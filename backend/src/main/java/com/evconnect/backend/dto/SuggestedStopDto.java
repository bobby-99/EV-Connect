package com.evconnect.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class SuggestedStopDto {
    private Long stationId;
    private String name;
    private String network;
    private String address;
    private Double latitude;
    private Double longitude;
    private List<String> connectorTypes;
    private BigDecimal pricePerKwh;
    private Integer availableSlots;
    private Integer totalSlots;
    private Double distanceFromStartKm;
    private Double remainingRangeAtStopKm;
    private String reason;

    public SuggestedStopDto() {}

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNetwork() { return network; }
    public void setNetwork(String network) { this.network = network; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public List<String> getConnectorTypes() { return connectorTypes; }
    public void setConnectorTypes(List<String> connectorTypes) { this.connectorTypes = connectorTypes; }

    public BigDecimal getPricePerKwh() { return pricePerKwh; }
    public void setPricePerKwh(BigDecimal pricePerKwh) { this.pricePerKwh = pricePerKwh; }

    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }

    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }

    public Double getDistanceFromStartKm() { return distanceFromStartKm; }
    public void setDistanceFromStartKm(Double distanceFromStartKm) { this.distanceFromStartKm = distanceFromStartKm; }

    public Double getRemainingRangeAtStopKm() { return remainingRangeAtStopKm; }
    public void setRemainingRangeAtStopKm(Double remainingRangeAtStopKm) { this.remainingRangeAtStopKm = remainingRangeAtStopKm; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
