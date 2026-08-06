package com.evconnect.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference_code", length = 50)
    private String bookingReferenceCode;

    @Column(name = "station_id")
    private Long stationId;

    @Column(name = "slot_id")
    private Long slotId;

    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "vehicle_type", length = 50)
    private String vehicleType;

    @Column(name = "booking_time")
    private LocalDateTime bookingTime;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "status", length = 20)
    private String status = "confirmed";

    public Booking() {}

    public Booking(String bookingReferenceCode, Long stationId, Long slotId, String customerName,
                   String vehicleType, LocalDateTime bookingTime, Integer durationMinutes, String status) {
        this.bookingReferenceCode = bookingReferenceCode;
        this.stationId = stationId;
        this.slotId = slotId;
        this.customerName = customerName;
        this.vehicleType = vehicleType;
        this.bookingTime = bookingTime;
        this.durationMinutes = durationMinutes;
        this.status = status != null ? status : "confirmed";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingReferenceCode() { return bookingReferenceCode; }
    public void setBookingReferenceCode(String bookingReferenceCode) { this.bookingReferenceCode = bookingReferenceCode; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
