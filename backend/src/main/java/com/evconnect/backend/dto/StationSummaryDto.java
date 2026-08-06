package com.evconnect.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class StationSummaryDto {
    private Long id;
    private String name;
    private String network;
    private String city;
    private Double latitude;
    private Double longitude;
    private List<String> connectorTypes;
    private BigDecimal pricePerKwh;
    private Integer totalSlots;
    private Integer availableSlots;
    private Integer busySlots;
    private Integer fullSlots;
    private String status; // GREEN ("available"), AMBER ("busy"), RED ("full")
    private String address;
    private Double distanceKm;
    private Double score;
    private String scoreExplanation;

    public StationSummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNetwork() { return network; }
    public void setNetwork(String network) { this.network = network; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public List<String> getConnectorTypes() { return connectorTypes; }
    public void setConnectorTypes(List<String> connectorTypes) { this.connectorTypes = connectorTypes; }

    public BigDecimal getPricePerKwh() { return pricePerKwh; }
    public void setPricePerKwh(BigDecimal pricePerKwh) { this.pricePerKwh = pricePerKwh; }

    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }

    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }

    public Integer getBusySlots() { return busySlots; }
    public void setBusySlots(Integer busySlots) { this.busySlots = busySlots; }

    public Integer getFullSlots() { return fullSlots; }
    public void setFullSlots(Integer fullSlots) { this.fullSlots = fullSlots; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public String getScoreExplanation() { return scoreExplanation; }
    public void setScoreExplanation(String scoreExplanation) { this.scoreExplanation = scoreExplanation; }
}
