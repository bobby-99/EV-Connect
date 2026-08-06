package com.evconnect.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "usage_history")
public class UsageHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "station_id")
    private Long stationId;

    @Column(name = "hour_of_day")
    private Integer hourOfDay;

    @Column(name = "day_of_week")
    private Integer dayOfWeek;

    @Column(name = "occupancy_pct", precision = 5, scale = 2)
    private BigDecimal occupancyPct;

    public UsageHistory() {}

    public UsageHistory(Long stationId, Integer hourOfDay, Integer dayOfWeek, BigDecimal occupancyPct) {
        this.stationId = stationId;
        this.hourOfDay = hourOfDay;
        this.dayOfWeek = dayOfWeek;
        this.occupancyPct = occupancyPct;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

    public Integer getHourOfDay() { return hourOfDay; }
    public void setHourOfDay(Integer hourOfDay) { this.hourOfDay = hourOfDay; }

    public Integer getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public BigDecimal getOccupancyPct() { return occupancyPct; }
    public void setOccupancyPct(BigDecimal occupancyPct) { this.occupancyPct = occupancyPct; }
}
