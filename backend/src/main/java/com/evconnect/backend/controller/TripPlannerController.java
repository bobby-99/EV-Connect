package com.evconnect.backend.controller;

import com.evconnect.backend.dto.TripPlanRequestDto;
import com.evconnect.backend.dto.TripPlanResponseDto;
import com.evconnect.backend.service.TripPlannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trip-plan")
public class TripPlannerController {

    private final TripPlannerService tripPlannerService;

    public TripPlannerController(TripPlannerService tripPlannerService) {
        this.tripPlannerService = tripPlannerService;
    }

    @PostMapping
    public ResponseEntity<TripPlanResponseDto> planTrip(@RequestBody TripPlanRequestDto request) {
        TripPlanResponseDto plan = tripPlannerService.planTrip(request);
        return ResponseEntity.ok(plan);
    }
}
