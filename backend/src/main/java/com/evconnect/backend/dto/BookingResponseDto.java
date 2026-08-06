package com.evconnect.backend.dto;

import java.time.LocalDateTime;

public class BookingResponseDto {
    private Long id;
    private String bookingReferenceCode;
    private Long stationId;
    private String stationName;
    private String stationAddress;
    private String network;
    private Long slotId;
    private Integer slotNumber;
    private String customerName;
    private String vehicleType;
    private LocalDateTime bookingTime;
    private Integer durationMinutes;
    private String status;

    public BookingResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingReferenceCode() { return bookingReferenceCode; }
    public void setBookingReferenceCode(String bookingReferenceCode) { this.bookingReferenceCode = bookingReferenceCode; }

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

    public String getStationAddress() { return stationAddress; }
    public void setStationAddress(String stationAddress) { this.stationAddress = stationAddress; }

    public String getNetwork() { return network; }
    public void setNetwork(String network) { this.network = network; }

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

    public Integer getSlotNumber() { return slotNumber; }
    public void setSlotNumber(Integer slotNumber) { this.slotNumber = slotNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
