package com.evconnect.backend.dto;

import java.util.List;

public class TripPlanResponseDto {
    private String startName;
    private Double startLat;
    private Double startLng;
    private String destName;
    private Double destLat;
    private Double destLng;
    private Double totalDistanceKm;
    private Integer estimatedDurationMinutes;
    private String vehicleType;
    private Double vehicleRangeKm;
    private Boolean isStopRequired;
    private List<double[]> routeCoordinates;
    private List<SuggestedStopDto> suggestedStops;
    private String summaryMessage;
    private Boolean isIllustrative;

    public TripPlanResponseDto() {}

    public String getStartName() { return startName; }
    public void setStartName(String startName) { this.startName = startName; }

    public Double getStartLat() { return startLat; }
    public void setStartLat(Double startLat) { this.startLat = startLat; }

    public Double getStartLng() { return startLng; }
    public void setStartLng(Double startLng) { this.startLng = startLng; }

    public String getDestName() { return destName; }
    public void setDestName(String destName) { this.destName = destName; }

    public Double getDestLat() { return destLat; }
    public void setDestLat(Double destLat) { this.destLat = destLat; }

    public Double getDestLng() { return destLng; }
    public void setDestLng(Double destLng) { this.destLng = destLng; }

    public Double getTotalDistanceKm() { return totalDistanceKm; }
    public void setTotalDistanceKm(Double totalDistanceKm) { this.totalDistanceKm = totalDistanceKm; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public Double getVehicleRangeKm() { return vehicleRangeKm; }
    public void setVehicleRangeKm(Double vehicleRangeKm) { this.vehicleRangeKm = vehicleRangeKm; }

    public Boolean getIsStopRequired() { return isStopRequired; }
    public void setIsStopRequired(Boolean isStopRequired) { this.isStopRequired = isStopRequired; }

    public List<double[]> getRouteCoordinates() { return routeCoordinates; }
    public void setRouteCoordinates(List<double[]> routeCoordinates) { this.routeCoordinates = routeCoordinates; }

    public List<SuggestedStopDto> getSuggestedStops() { return suggestedStops; }
    public void setSuggestedStops(List<SuggestedStopDto> suggestedStops) { this.suggestedStops = suggestedStops; }

    public String getSummaryMessage() { return summaryMessage; }
    public void setSummaryMessage(String summaryMessage) { this.summaryMessage = summaryMessage; }

    public Boolean getIsIllustrative() { return isIllustrative; }
    public void setIsIllustrative(Boolean isIllustrative) { this.isIllustrative = isIllustrative; }
}
