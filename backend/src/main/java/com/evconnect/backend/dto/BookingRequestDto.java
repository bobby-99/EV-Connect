package com.evconnect.backend.dto;

import java.time.LocalDateTime;

public class BookingRequestDto {
    private Long stationId;
    private Long slotId;
    private String customerName;
    private String vehicleType;
    private LocalDateTime bookingTime;
    private Integer durationMinutes;

    public BookingRequestDto() {}

    public BookingRequestDto(Long stationId, Long slotId, String customerName, String vehicleType,
                             LocalDateTime bookingTime, Integer durationMinutes) {
        this.stationId = stationId;
        this.slotId = slotId;
        this.customerName = customerName;
        this.vehicleType = vehicleType;
        this.bookingTime = bookingTime;
        this.durationMinutes = durationMinutes;
    }

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}
