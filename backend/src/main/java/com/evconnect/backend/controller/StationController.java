package com.evconnect.backend.controller;

import com.evconnect.backend.dto.HeatmapDataDto;
import com.evconnect.backend.dto.StationDetailDto;
import com.evconnect.backend.dto.StationSummaryDto;
import com.evconnect.backend.dto.WaitTimePredictionDto;
import com.evconnect.backend.service.StationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping
    public ResponseEntity<List<StationSummaryDto>> getAllStations() {
        List<StationSummaryDto> stations = stationService.getAllStationsSummary();
        return ResponseEntity.ok(stations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StationDetailDto> getStationById(@PathVariable Long id) {
        StationDetailDto station = stationService.getStationDetail(id);
        return ResponseEntity.ok(station);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<StationSummaryDto>> getNearbyStations(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false, defaultValue = "10.0") Double radius) {
        List<StationSummaryDto> stations = stationService.getNearbyStations(lat, lng, radius);
        return ResponseEntity.ok(stations);
    }

    @GetMapping("/nearest-available")
    public ResponseEntity<List<StationSummaryDto>> getNearestAvailableStations(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false, defaultValue = "20.0") Double radius) {
        List<StationSummaryDto> rankedStations = stationService.findNearestAvailable(lat, lng, radius);
        return ResponseEntity.ok(rankedStations);
    }

    @GetMapping("/{id}/predict-wait")
    public ResponseEntity<WaitTimePredictionDto> predictWaitTime(@PathVariable Long id) {
        WaitTimePredictionDto prediction = stationService.predictWaitTime(id);
        return ResponseEntity.ok(prediction);
    }

    @GetMapping("/{id}/heatmap")
    public ResponseEntity<HeatmapDataDto> getStationHeatmap(@PathVariable Long id) {
        HeatmapDataDto heatmapData = stationService.getStationHeatmap(id);
        return ResponseEntity.ok(heatmapData);
    }
}
