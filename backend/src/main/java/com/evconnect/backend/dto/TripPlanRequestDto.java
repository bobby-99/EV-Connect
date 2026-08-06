package com.evconnect.backend.dto;

public class TripPlanRequestDto {
    private String startLocation;
    private Double startLat;
    private Double startLng;
    private String destLocation;
    private Double destLat;
    private Double destLng;
    private String vehicleType;

    public TripPlanRequestDto() {}

    public String getStartLocation() { return startLocation; }
    public void setStartLocation(String startLocation) { this.startLocation = startLocation; }

    public Double getStartLat() { return startLat; }
    public void setStartLat(Double startLat) { this.startLat = startLat; }

    public Double getStartLng() { return startLng; }
    public void setStartLng(Double startLng) { this.startLng = startLng; }

    public String getDestLocation() { return destLocation; }
    public void setDestLocation(String destLocation) { this.destLocation = destLocation; }

    public Double getDestLat() { return destLat; }
    public void setDestLat(Double destLat) { this.destLat = destLat; }

    public Double getDestLng() { return destLng; }
    public void setDestLng(Double destLng) { this.destLng = destLng; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
}
