package com.evconnect.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class HeatmapDataDto {
    private Long stationId;
    private String stationName;
    private List<HourlyTrendDto> hourlyTrends;
    private List<DailyHeatmapDto> dailyHeatmap;

    public HeatmapDataDto() {}

    public HeatmapDataDto(Long stationId, String stationName, List<HourlyTrendDto> hourlyTrends, List<DailyHeatmapDto> dailyHeatmap) {
        this.stationId = stationId;
        this.stationName = stationName;
        this.hourlyTrends = hourlyTrends;
        this.dailyHeatmap = dailyHeatmap;
    }

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

    public List<HourlyTrendDto> getHourlyTrends() { return hourlyTrends; }
    public void setHourlyTrends(List<HourlyTrendDto> hourlyTrends) { this.hourlyTrends = hourlyTrends; }

    public List<DailyHeatmapDto> getDailyHeatmap() { return dailyHeatmap; }
    public void setDailyHeatmap(List<DailyHeatmapDto> dailyHeatmap) { this.dailyHeatmap = dailyHeatmap; }

    public static class HourlyTrendDto {
        private Integer hourOfDay;
        private String formattedHour;
        private Double avgOccupancyPct;
        private String peakLevel; // "low", "moderate", "high"

        public HourlyTrendDto() {}

        public HourlyTrendDto(Integer hourOfDay, String formattedHour, Double avgOccupancyPct, String peakLevel) {
            this.hourOfDay = hourOfDay;
            this.formattedHour = formattedHour;
            this.avgOccupancyPct = avgOccupancyPct;
            this.peakLevel = peakLevel;
        }

        public Integer getHourOfDay() { return hourOfDay; }
        public void setHourOfDay(Integer hourOfDay) { this.hourOfDay = hourOfDay; }

        public String getFormattedHour() { return formattedHour; }
        public void setFormattedHour(String formattedHour) { this.formattedHour = formattedHour; }

        public Double getAvgOccupancyPct() { return avgOccupancyPct; }
        public void setAvgOccupancyPct(Double avgOccupancyPct) { this.avgOccupancyPct = avgOccupancyPct; }

        public String getPeakLevel() { return peakLevel; }
        public void setPeakLevel(String peakLevel) { this.peakLevel = peakLevel; }
    }

    public static class DailyHeatmapDto {
        private Integer dayOfWeek;
        private String dayName;
        private List<Double> hourlyOccupancy;

        public DailyHeatmapDto() {}

        public DailyHeatmapDto(Integer dayOfWeek, String dayName, List<Double> hourlyOccupancy) {
            this.dayOfWeek = dayOfWeek;
            this.dayName = dayName;
            this.hourlyOccupancy = hourlyOccupancy;
        }

        public Integer getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }

        public String getDayName() { return dayName; }
        public void setDayName(String dayName) { this.dayName = dayName; }

        public List<Double> getHourlyOccupancy() { return hourlyOccupancy; }
        public void setHourlyOccupancy(List<Double> hourlyOccupancy) { this.hourlyOccupancy = hourlyOccupancy; }
    }
}
