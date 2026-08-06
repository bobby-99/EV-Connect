package com.evconnect.backend.dto;

public class WaitTimePredictionDto {
    private Long stationId;
    private String stationName;
    private Integer predictedWaitMinutes;
    private Boolean isAvailableNow;
    private Integer busySlotsCount;
    private Integer totalSlotsCount;
    private String primaryConnectorType;
    private String explanation;

    public WaitTimePredictionDto() {}

    public WaitTimePredictionDto(Long stationId, String stationName, Integer predictedWaitMinutes,
                                 Boolean isAvailableNow, Integer busySlotsCount, Integer totalSlotsCount,
                                 String primaryConnectorType, String explanation) {
        this.stationId = stationId;
        this.stationName = stationName;
        this.predictedWaitMinutes = predictedWaitMinutes;
        this.isAvailableNow = isAvailableNow;
        this.busySlotsCount = busySlotsCount;
        this.totalSlotsCount = totalSlotsCount;
        this.primaryConnectorType = primaryConnectorType;
        this.explanation = explanation;
    }

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

    public Integer getPredictedWaitMinutes() { return predictedWaitMinutes; }
    public void setPredictedWaitMinutes(Integer predictedWaitMinutes) { this.predictedWaitMinutes = predictedWaitMinutes; }

    public Boolean getIsAvailableNow() { return isAvailableNow; }
    public void setIsAvailableNow(Boolean isAvailableNow) { this.isAvailableNow = isAvailableNow; }

    public Integer getBusySlotsCount() { return busySlotsCount; }
    public void setBusySlotsCount(Integer busySlotsCount) { this.busySlotsCount = busySlotsCount; }

    public Integer getTotalSlotsCount() { return totalSlotsCount; }
    public void setTotalSlotsCount(Integer totalSlotsCount) { this.totalSlotsCount = totalSlotsCount; }

    public String getPrimaryConnectorType() { return primaryConnectorType; }
    public void setPrimaryConnectorType(String primaryConnectorType) { this.primaryConnectorType = primaryConnectorType; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
