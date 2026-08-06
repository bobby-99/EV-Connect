package com.evconnect.backend.service;

import com.evconnect.backend.dto.*;
import com.evconnect.backend.model.SlotStatus;
import com.evconnect.backend.model.Station;
import com.evconnect.backend.model.UsageHistory;
import com.evconnect.backend.repository.SlotStatusRepository;
import com.evconnect.backend.repository.StationRepository;
import com.evconnect.backend.repository.UsageHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StationService {

    private final StationRepository stationRepository;
    private final SlotStatusRepository slotStatusRepository;
    private final UsageHistoryRepository usageHistoryRepository;

    public StationService(StationRepository stationRepository,
                          SlotStatusRepository slotStatusRepository,
                          UsageHistoryRepository usageHistoryRepository) {
        this.stationRepository = stationRepository;
        this.slotStatusRepository = slotStatusRepository;
        this.usageHistoryRepository = usageHistoryRepository;
    }

    public List<StationSummaryDto> getAllStationsSummary() {
        return stationRepository.findAll().stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    public StationDetailDto getStationDetail(Long id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found with id: " + id));
        return mapToDetailDto(station);
    }

    public List<StationSummaryDto> getNearbyStations(Double lat, Double lng, Double radiusKm) {
        double searchRadius = (radiusKm != null && radiusKm > 0) ? radiusKm : 10.0;
        return stationRepository.findAll().stream()
                .map(station -> {
                    StationSummaryDto dto = mapToSummaryDto(station);
                    if (lat != null && lng != null) {
                        double distance = calculateHaversineDistance(lat, lng, station.getLatitude(), station.getLongitude());
                        dto.setDistanceKm(roundToTwoDecimals(distance));
                    }
                    return dto;
                })
                .filter(dto -> dto.getDistanceKm() == null || dto.getDistanceKm() <= searchRadius)
                .sorted(Comparator.comparing(dto -> dto.getDistanceKm() != null ? dto.getDistanceKm() : Double.MAX_VALUE))
                .collect(Collectors.toList());
    }

    public List<StationSummaryDto> findNearestAvailable(Double lat, Double lng, Double radiusKm) {
        double userLat = (lat != null) ? lat : 12.9716; // Default to Bangalore Center
        double userLng = (lng != null) ? lng : 77.5946;
        double searchRadius = (radiusKm != null && radiusKm > 0) ? radiusKm : 20.0;

        return stationRepository.findAll().stream()
                .map(station -> {
                    StationSummaryDto dto = mapToSummaryDto(station);
                    double distance = calculateHaversineDistance(userLat, userLng, station.getLatitude(), station.getLongitude());
                    dto.setDistanceKm(roundToTwoDecimals(distance));

                    int avail = dto.getAvailableSlots();
                    int total = dto.getTotalSlots() > 0 ? dto.getTotalSlots() : 1;
                    double availRatio = (double) avail / total;

                    double score;
                    String explanation;

                    if (avail == 0) {
                        score = distance * 15.0 + 50.0;
                        explanation = String.format("Distance %.1f km | 0/%d available (Full occupancy penalty applied)", distance, total);
                    } else {
                        score = distance * (1.0 + 2.0 * (1.0 - availRatio));
                        explanation = String.format("Distance %.1f km | %d/%d available (Score: %.2f)", distance, avail, total, score);
                    }

                    dto.setScore(roundToTwoDecimals(score));
                    dto.setScoreExplanation(explanation);
                    return dto;
                })
                .filter(dto -> dto.getDistanceKm() <= searchRadius)
                .sorted(Comparator.comparing(StationSummaryDto::getScore))
                .collect(Collectors.toList());
    }

    /**
     * Rule-based explainable wait-time prediction algorithm.
     */
    public WaitTimePredictionDto predictWaitTime(Long stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found with id: " + stationId));

        StationSummaryDto summary = mapToSummaryDto(station);
        int totalSlots = summary.getTotalSlots() > 0 ? summary.getTotalSlots() : 1;
        int availableSlots = summary.getAvailableSlots();
        int busySlots = summary.getBusySlots() + summary.getFullSlots();

        List<String> connectors = station.getConnectorTypes();
        String primaryConnector = connectors != null && !connectors.isEmpty() ? connectors.get(0) : "Type 2 AC";
        int avgSessionMinutes = 90;

        if (connectors != null) {
            if (connectors.contains("CCS2")) {
                primaryConnector = "CCS2";
                avgSessionMinutes = 30;
            } else if (connectors.contains("Bharat DC-001")) {
                primaryConnector = "Bharat DC-001";
                avgSessionMinutes = 45;
            } else if (connectors.contains("Type 2 AC")) {
                primaryConnector = "Type 2 AC";
                avgSessionMinutes = 90;
            }
        }

        if (availableSlots > 0) {
            return new WaitTimePredictionDto(
                stationId,
                station.getName(),
                0,
                true,
                busySlots,
                totalSlots,
                primaryConnector,
                String.format("Slot available right now! (%d/%d free)", availableSlots, totalSlots)
            );
        }

        int estimatedWait = (int) Math.round((double) avgSessionMinutes / totalSlots);
        if (estimatedWait < 5) estimatedWait = 5;

        String explanation = String.format(
            "All %d slots occupied on %s (~%d min avg session) → ~%d min wait for next slot",
            totalSlots, primaryConnector, avgSessionMinutes, estimatedWait
        );

        return new WaitTimePredictionDto(
            stationId,
            station.getName(),
            estimatedWait,
            false,
            busySlots,
            totalSlots,
            primaryConnector,
            explanation
        );
    }

    /**
     * Aggregates station usage history into 24-hour averages and 7x24 grid.
     */
    public HeatmapDataDto getStationHeatmap(Long stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found with id: " + stationId));

        List<UsageHistory> allHistory = usageHistoryRepository.findByStationId(stationId);

        // Group by hour and calculate average
        Map<Integer, List<Double>> hourMap = new HashMap<>();
        for (int h = 0; h < 24; h++) {
            hourMap.put(h, new ArrayList<>());
        }

        for (UsageHistory u : allHistory) {
            if (u.getHourOfDay() != null && u.getOccupancyPct() != null) {
                hourMap.computeIfAbsent(u.getHourOfDay(), k -> new ArrayList<>())
                        .add(u.getOccupancyPct().doubleValue());
            }
        }

        List<HeatmapDataDto.HourlyTrendDto> hourlyTrends = new ArrayList<>();
        for (int h = 0; h < 24; h++) {
            List<Double> vals = hourMap.get(h);
            double avgPct = (vals != null && !vals.isEmpty())
                    ? vals.stream().mapToDouble(Double::doubleValue).average().orElse(35.0)
                    : 35.0;

            avgPct = roundToTwoDecimals(avgPct);
            String peakLevel = (avgPct >= 75.0) ? "high" : (avgPct >= 50.0) ? "moderate" : "low";
            String formattedHour = String.format("%02d:00", h);
            hourlyTrends.add(new HeatmapDataDto.HourlyTrendDto(h, formattedHour, avgPct, peakLevel));
        }

        // Fetch full 7x24 grid
        String[] dayNames = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
        List<HeatmapDataDto.DailyHeatmapDto> dailyHeatmap = new ArrayList<>();

        for (int day = 0; day < 7; day++) {
            final int dayIdx = day;
            List<Double> hourlyValues = new ArrayList<>(Collections.nCopies(24, 0.0));
            allHistory.stream()
                    .filter(u -> u.getDayOfWeek() != null && u.getDayOfWeek() == dayIdx)
                    .forEach(u -> {
                        if (u.getHourOfDay() != null && u.getHourOfDay() >= 0 && u.getHourOfDay() < 24) {
                            hourlyValues.set(u.getHourOfDay(), u.getOccupancyPct() != null ? u.getOccupancyPct().doubleValue() : 0.0);
                        }
                    });
            dailyHeatmap.add(new HeatmapDataDto.DailyHeatmapDto(day, dayNames[day], hourlyValues));
        }

        return new HeatmapDataDto(stationId, station.getName(), hourlyTrends, dailyHeatmap);
    }

    public StationSummaryDto mapToSummaryDto(Station station) {
        StationSummaryDto dto = new StationSummaryDto();
        dto.setId(station.getId());
        dto.setName(station.getName());
        dto.setNetwork(station.getNetwork());
        dto.setCity(station.getCity());
        dto.setLatitude(station.getLatitude());
        dto.setLongitude(station.getLongitude());
        dto.setConnectorTypes(station.getConnectorTypes());
        dto.setPricePerKwh(station.getPricePerKwh());
        dto.setTotalSlots(station.getTotalSlots());
        dto.setAddress(station.getAddress());

        int availableCount = 0;
        int busyCount = 0;
        int fullCount = 0;

        if (station.getSlots() != null) {
            for (SlotStatus slot : station.getSlots()) {
                String st = slot.getStatus() != null ? slot.getStatus().toLowerCase() : "available";
                switch (st) {
                    case "available":
                    case "green":
                        availableCount++;
                        break;
                    case "busy":
                    case "amber":
                    case "in_use":
                    case "charging":
                    case "reserved":
                        busyCount++;
                        break;
                    case "full":
                    case "out_of_service":
                    case "red":
                    default:
                        fullCount++;
                        break;
                }
            }
        }

        dto.setAvailableSlots(availableCount);
        dto.setBusySlots(busyCount);
        dto.setFullSlots(fullCount);

        if (availableCount > 0) {
            dto.setStatus("available");
        } else if (busyCount > 0) {
            dto.setStatus("busy");
        } else {
            dto.setStatus("full");
        }

        return dto;
    }

    public StationDetailDto mapToDetailDto(Station station) {
        StationSummaryDto summary = mapToSummaryDto(station);
        StationDetailDto detail = new StationDetailDto();
        detail.setId(summary.getId());
        detail.setName(summary.getName());
        detail.setNetwork(summary.getNetwork());
        detail.setCity(summary.getCity());
        detail.setLatitude(summary.getLatitude());
        detail.setLongitude(summary.getLongitude());
        detail.setConnectorTypes(summary.getConnectorTypes());
        detail.setPricePerKwh(summary.getPricePerKwh());
        detail.setTotalSlots(summary.getTotalSlots());
        detail.setAvailableSlots(summary.getAvailableSlots());
        detail.setBusySlots(summary.getBusySlots());
        detail.setFullSlots(summary.getFullSlots());
        detail.setStatus(summary.getStatus());
        detail.setAddress(summary.getAddress());

        if (station.getSlots() != null) {
            List<SlotStatusDto> slotDtos = station.getSlots().stream()
                    .map(s -> new SlotStatusDto(s.getId(), s.getSlotNumber(), s.getStatus(), s.getUpdatedAt()))
                    .collect(Collectors.toList());
            detail.setSlots(slotDtos);
        }

        return detail;
    }

    public static double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
