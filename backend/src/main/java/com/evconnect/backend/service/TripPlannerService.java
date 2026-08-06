package com.evconnect.backend.service;

import com.evconnect.backend.config.VehicleRangeRegistry;
import com.evconnect.backend.dto.StationSummaryDto;
import com.evconnect.backend.dto.SuggestedStopDto;
import com.evconnect.backend.dto.TripPlanRequestDto;
import com.evconnect.backend.dto.TripPlanResponseDto;
import com.evconnect.backend.model.Station;
import com.evconnect.backend.repository.StationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

@Service
public class TripPlannerService {

    @Value("${ors.api.key:${ORS_API_KEY:}}")
    private String orsApiKey;

    private final StationRepository stationRepository;
    private final StationService stationService;
    private final RestTemplate restTemplate = new RestTemplate();

    // Preset Bangalore location geocodes
    private static final Map<String, double[]> PRESET_LOCATIONS = new HashMap<>();

    static {
        PRESET_LOCATIONS.put("koramangala", new double[]{12.9345, 77.6111});
        PRESET_LOCATIONS.put("indiranagar", new double[]{12.9784, 77.6408});
        PRESET_LOCATIONS.put("whitefield", new double[]{12.9863, 77.7381});
        PRESET_LOCATIONS.put("electronic city", new double[]{12.8399, 77.6649});
        PRESET_LOCATIONS.put("hsr layout", new double[]{12.9116, 77.6474});
        PRESET_LOCATIONS.put("bellandur", new double[]{12.9257, 77.6835});
        PRESET_LOCATIONS.put("hebbal", new double[]{13.0450, 77.6200});
        PRESET_LOCATIONS.put("mg road", new double[]{12.9756, 77.6067});
        PRESET_LOCATIONS.put("jayanagar", new double[]{12.9298, 77.5826});
        PRESET_LOCATIONS.put("malleshwaram", new double[]{12.9980, 77.5710});
        PRESET_LOCATIONS.put("rajajinagar", new double[]{13.0112, 77.5550});
        PRESET_LOCATIONS.put("mysore", new double[]{12.2958, 76.6394});
        PRESET_LOCATIONS.put("hosur", new double[]{12.7409, 77.8253});
        PRESET_LOCATIONS.put("sarjapur", new double[]{12.9100, 77.6750});
        PRESET_LOCATIONS.put("btm layout", new double[]{12.9166, 77.6101});
        PRESET_LOCATIONS.put("marathahalli", new double[]{12.9560, 77.7010});
        PRESET_LOCATIONS.put("domlur", new double[]{12.9550, 77.6480});
        PRESET_LOCATIONS.put("yelahanka", new double[]{13.1007, 77.5963});
        PRESET_LOCATIONS.put("kengeri", new double[]{12.8996, 77.4827});
    }

    public TripPlannerService(StationRepository stationRepository, StationService stationService) {
        this.stationRepository = stationRepository;
        this.stationService = stationService;
    }

    public TripPlanResponseDto planTrip(TripPlanRequestDto request) {
        // Resolve start & destination coordinates
        double[] startCoords = resolveCoordinates(request.getStartLocation(), request.getStartLat(), request.getStartLng(), 13.0450, 77.6200);
        double[] destCoords = resolveCoordinates(request.getDestLocation(), request.getDestLat(), request.getDestLng(), 12.8399, 77.6649);

        String startName = request.getStartLocation() != null && !request.getStartLocation().trim().isEmpty() ? request.getStartLocation() : "Start Origin";
        String destName = request.getDestLocation() != null && !request.getDestLocation().trim().isEmpty() ? request.getDestLocation() : "Destination";

        String vehicleType = request.getVehicleType() != null ? request.getVehicleType() : "Tata Nexon EV";
        double vehicleRange = VehicleRangeRegistry.getVehicleRange(vehicleType);

        List<double[]> polyline = new ArrayList<>();
        double totalDistanceKm = 0.0;
        int durationMinutes = 0;

        // Try OpenRouteService first if API key is present
        if (orsApiKey != null && !orsApiKey.trim().isEmpty()) {
            try {
                String url = String.format(
                        "https://api.openrouteservice.org/v2/directions/driving-car?api_key=%s&start=%f,%f&end=%f,%f",
                        orsApiKey.trim(), startCoords[1], startCoords[0], destCoords[1], destCoords[0]
                );
                ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    Map body = response.getBody();
                    List features = (List) body.get("features");
                    if (features != null && !features.isEmpty()) {
                        Map firstFeature = (Map) features.get(0);
                        Map properties = (Map) firstFeature.get("properties");
                        Map summary = (Map) properties.get("summary");
                        Number distNum = (Number) summary.get("distance");
                        Number durNum = (Number) summary.get("duration");

                        totalDistanceKm = roundToTwoDecimals(distNum.doubleValue() / 1000.0);
                        durationMinutes = (int) Math.round(durNum.doubleValue() / 60.0);

                        Map geometry = (Map) firstFeature.get("geometry");
                        List<List<Number>> coords = (List<List<Number>>) geometry.get("coordinates");
                        if (coords != null) {
                            for (List<Number> pt : coords) {
                                polyline.add(new double[]{pt.get(1).doubleValue(), pt.get(0).doubleValue()});
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("TripPlannerService: ORS API skipped (" + e.getMessage() + "), trying OSRM public router...");
            }
        }

        // Fetch real road geometry from OSRM free public routing engine
        if (polyline.isEmpty()) {
            try {
                String osrmUrl = String.format(
                        Locale.US,
                        "http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson",
                        startCoords[1], startCoords[0], destCoords[1], destCoords[0]
                );

                ResponseEntity<Map> response = restTemplate.getForEntity(osrmUrl, Map.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    Map body = response.getBody();
                    List routes = (List) body.get("routes");
                    if (routes != null && !routes.isEmpty()) {
                        Map route = (Map) routes.get(0);
                        Number distNum = (Number) route.get("distance"); // meters
                        Number durNum = (Number) route.get("duration"); // seconds

                        totalDistanceKm = roundToTwoDecimals(distNum.doubleValue() / 1000.0);
                        durationMinutes = (int) Math.round(durNum.doubleValue() / 60.0);

                        Map geometry = (Map) route.get("geometry");
                        List<List<Number>> coords = (List<List<Number>>) geometry.get("coordinates");
                        if (coords != null) {
                            for (List<Number> pt : coords) {
                                // OSRM returns [longitude, latitude], convert to [latitude, longitude]
                                polyline.add(new double[]{pt.get(1).doubleValue(), pt.get(0).doubleValue()});
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("TripPlannerService: OSRM route fetch failed (" + e.getMessage() + ")");
            }
        }

        // Final fallback if both routing engines fail
        if (polyline.isEmpty()) {
            double straightDistance = StationService.calculateHaversineDistance(startCoords[0], startCoords[1], destCoords[0], destCoords[1]);
            totalDistanceKm = roundToTwoDecimals(straightDistance * 1.25);
            durationMinutes = (int) Math.round((totalDistanceKm / 45.0) * 60.0);

            for (int i = 0; i <= 30; i++) {
                double fraction = i / 30.0;
                double lat = startCoords[0] + (destCoords[0] - startCoords[0]) * fraction;
                double lng = startCoords[1] + (destCoords[1] - startCoords[1]) * fraction;
                polyline.add(new double[]{roundToFourDecimals(lat), roundToFourDecimals(lng)});
            }
        }

        boolean isStopRequired = totalDistanceKm > vehicleRange;
        List<SuggestedStopDto> suggestedStops = new ArrayList<>();
        boolean isIllustrative = false;

        if (isStopRequired) {
            double targetStopDistance = vehicleRange * 0.80;

            // Trace along the real road polyline to find coordinate at targetStopDistance
            double accumDist = 0.0;
            double[] targetPoint = polyline.get(polyline.size() / 2);

            for (int i = 1; i < polyline.size(); i++) {
                double segmentDist = StationService.calculateHaversineDistance(
                        polyline.get(i - 1)[0], polyline.get(i - 1)[1],
                        polyline.get(i)[0], polyline.get(i)[1]
                );
                accumDist += segmentDist;
                if (accumDist >= targetStopDistance) {
                    targetPoint = polyline.get(i);
                    break;
                }
            }

            final double[] refPoint = targetPoint;
            List<Station> stations = stationRepository.findAll();

            Station bestStation = null;
            double minStationDist = Double.MAX_VALUE;

            for (Station st : stations) {
                double d = StationService.calculateHaversineDistance(refPoint[0], refPoint[1], st.getLatitude(), st.getLongitude());
                if (d < minStationDist) {
                    minStationDist = d;
                    bestStation = st;
                }
            }

            if (bestStation != null && minStationDist < 30.0) {
                StationSummaryDto summary = stationService.mapToSummaryDto(bestStation);
                double remainingRangeBeforeEmpty = roundToTwoDecimals(vehicleRange - targetStopDistance);

                SuggestedStopDto stopDto = new SuggestedStopDto();
                stopDto.setStationId(bestStation.getId());
                stopDto.setName(bestStation.getName());
                stopDto.setNetwork(bestStation.getNetwork());
                stopDto.setAddress(bestStation.getAddress());
                stopDto.setLatitude(bestStation.getLatitude());
                stopDto.setLongitude(bestStation.getLongitude());
                stopDto.setConnectorTypes(bestStation.getConnectorTypes());
                stopDto.setPricePerKwh(bestStation.getPricePerKwh());
                stopDto.setAvailableSlots(summary.getAvailableSlots());
                stopDto.setTotalSlots(summary.getTotalSlots());
                stopDto.setDistanceFromStartKm(roundToTwoDecimals(targetStopDistance));
                stopDto.setRemainingRangeAtStopKm(remainingRangeBeforeEmpty);
                stopDto.setReason(String.format("Optimal charging stop ~%.0f km before battery depletion", remainingRangeBeforeEmpty));

                suggestedStops.add(stopDto);
            } else {
                isIllustrative = true;
                SuggestedStopDto fallbackStop = new SuggestedStopDto();
                fallbackStop.setStationId(0L);
                fallbackStop.setName("Highway Fast Charger (Illustrative)");
                fallbackStop.setNetwork("National EV Highway Network");
                fallbackStop.setAddress("NH-44 Highway Service Station");
                fallbackStop.setLatitude(targetPoint[0]);
                fallbackStop.setLongitude(targetPoint[1]);
                fallbackStop.setConnectorTypes(Arrays.asList("CCS2", "Type 2 AC"));
                fallbackStop.setPricePerKwh(new BigDecimal("15.00"));
                fallbackStop.setAvailableSlots(4);
                fallbackStop.setTotalSlots(6);
                fallbackStop.setDistanceFromStartKm(roundToTwoDecimals(targetStopDistance));
                fallbackStop.setRemainingRangeAtStopKm(roundToTwoDecimals(vehicleRange - targetStopDistance));
                fallbackStop.setReason("Suggested highway stop outside seeded Bangalore area");

                suggestedStops.add(fallbackStop);
            }
        }

        String summaryMsg;
        if (!isStopRequired) {
            summaryMsg = String.format("%.0f km trip — within your %s range (%.0f km). No charging stop needed!",
                    totalDistanceKm, vehicleType, vehicleRange);
        } else {
            String stopName = !suggestedStops.isEmpty() ? suggestedStops.get(0).getName() : "Highway Charger";
            double remKm = !suggestedStops.isEmpty() ? suggestedStops.get(0).getRemainingRangeAtStopKm() : 25.0;
            summaryMsg = String.format("%.0f km trip — 1 charging stop required: %s (~%.0f km before empty)",
                    totalDistanceKm, stopName, remKm);
        }

        TripPlanResponseDto response = new TripPlanResponseDto();
        response.setStartName(startName);
        response.setStartLat(startCoords[0]);
        response.setStartLng(startCoords[1]);
        response.setDestName(destName);
        response.setDestLat(destCoords[0]);
        response.setDestLng(destCoords[1]);
        response.setTotalDistanceKm(totalDistanceKm);
        response.setEstimatedDurationMinutes(durationMinutes);
        response.setVehicleType(vehicleType);
        response.setVehicleRangeKm(vehicleRange);
        response.setIsStopRequired(isStopRequired);
        response.setRouteCoordinates(polyline);
        response.setSuggestedStops(suggestedStops);
        response.setSummaryMessage(summaryMsg);
        response.setIsIllustrative(isIllustrative);

        return response;
    }

    private double[] resolveCoordinates(String locationName, Double inputLat, Double inputLng, double defaultLat, double defaultLng) {
        if (inputLat != null && inputLng != null && inputLat != 0.0 && inputLng != 0.0) {
            return new double[]{inputLat, inputLng};
        }

        if (locationName != null && !locationName.trim().isEmpty()) {
            String cleanName = locationName.trim().toLowerCase();
            for (Map.Entry<String, double[]> entry : PRESET_LOCATIONS.entrySet()) {
                if (cleanName.contains(entry.getKey())) {
                    return entry.getValue();
                }
            }
        }

        return new double[]{defaultLat, defaultLng};
    }

    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private double roundToFourDecimals(double value) {
        return Math.round(value * 10000.0) / 10000.0;
    }
}
