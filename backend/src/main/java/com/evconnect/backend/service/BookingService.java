package com.evconnect.backend.service;

import com.evconnect.backend.dto.BookingRequestDto;
import com.evconnect.backend.dto.BookingResponseDto;
import com.evconnect.backend.model.Booking;
import com.evconnect.backend.model.SlotStatus;
import com.evconnect.backend.model.Station;
import com.evconnect.backend.repository.BookingRepository;
import com.evconnect.backend.repository.SlotStatusRepository;
import com.evconnect.backend.repository.StationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final StationRepository stationRepository;
    private final SlotStatusRepository slotStatusRepository;
    private final Random random = new Random();

    public BookingService(BookingRepository bookingRepository,
                          StationRepository stationRepository,
                          SlotStatusRepository slotStatusRepository) {
        this.bookingRepository = bookingRepository;
        this.stationRepository = stationRepository;
        this.slotStatusRepository = slotStatusRepository;
    }

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request) {
        if (request.getStationId() == null) {
            throw new IllegalArgumentException("Station ID is required for booking.");
        }
        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required.");
        }

        Station station = stationRepository.findById(request.getStationId())
                .orElseThrow(() -> new IllegalArgumentException("Station not found with id: " + request.getStationId()));

        SlotStatus targetSlot = null;

        if (request.getSlotId() != null) {
            targetSlot = slotStatusRepository.findById(request.getSlotId())
                    .orElseThrow(() -> new IllegalArgumentException("Slot not found with id: " + request.getSlotId()));
            if (!targetSlot.getStation().getId().equals(station.getId())) {
                throw new IllegalArgumentException("Slot does not belong to the selected station.");
            }
        } else {
            // Auto-assign first available slot
            targetSlot = station.getSlots().stream()
                    .filter(s -> "available".equalsIgnoreCase(s.getStatus()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("No available charging slots at " + station.getName()));
        }

        // Validate availability
        if (!"available".equalsIgnoreCase(targetSlot.getStatus())) {
            throw new IllegalStateException("Slot #" + targetSlot.getSlotNumber() + " is currently " + targetSlot.getStatus() + " and cannot be reserved.");
        }

        // Determine default duration if not specified
        int duration = (request.getDurationMinutes() != null && request.getDurationMinutes() > 0)
                ? request.getDurationMinutes()
                : (station.getConnectorTypes() != null && station.getConnectorTypes().contains("CCS2")) ? 30 : 90;

        LocalDateTime bookingTime = request.getBookingTime() != null ? request.getBookingTime() : LocalDateTime.now();
        String refCode = "EVC-BLR-" + (1000 + random.nextInt(9000));

        // Atomically reserve slot
        targetSlot.setStatus("reserved");
        targetSlot.setUpdatedAt(LocalDateTime.now());
        slotStatusRepository.save(targetSlot);

        // Save booking
        String vehicleType = (request.getVehicleType() != null && !request.getVehicleType().isEmpty())
                ? request.getVehicleType() : "Tata Nexon EV";

        Booking booking = new Booking(
                refCode,
                station.getId(),
                targetSlot.getId(),
                request.getCustomerName().trim(),
                vehicleType,
                bookingTime,
                duration,
                "confirmed"
        );

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponseDto(savedBooking, station, targetSlot);
    }

    @Transactional(readOnly = true)
    public BookingResponseDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));

        Station station = stationRepository.findById(booking.getStationId()).orElse(null);
        SlotStatus slot = slotStatusRepository.findById(booking.getSlotId()).orElse(null);

        return mapToResponseDto(booking, station, slot);
    }

    @Transactional(readOnly = true)
    public BookingResponseDto getBookingByRef(String refCode) {
        Booking booking = bookingRepository.findByBookingReferenceCode(refCode)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with reference code: " + refCode));

        Station station = stationRepository.findById(booking.getStationId()).orElse(null);
        SlotStatus slot = slotStatusRepository.findById(booking.getSlotId()).orElse(null);

        return mapToResponseDto(booking, station, slot);
    }

    private BookingResponseDto mapToResponseDto(Booking booking, Station station, SlotStatus slot) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setBookingReferenceCode(booking.getBookingReferenceCode());
        dto.setStationId(booking.getStationId());
        dto.setStationName(station != null ? station.getName() : "EV Station");
        dto.setStationAddress(station != null ? station.getAddress() : "");
        dto.setNetwork(station != null ? station.getNetwork() : "");
        dto.setSlotId(booking.getSlotId());
        dto.setSlotNumber(slot != null ? slot.getSlotNumber() : 1);
        dto.setCustomerName(booking.getCustomerName());
        dto.setVehicleType(booking.getVehicleType());
        dto.setBookingTime(booking.getBookingTime());
        dto.setDurationMinutes(booking.getDurationMinutes());
        dto.setStatus(booking.getStatus());
        return dto;
    }
}
