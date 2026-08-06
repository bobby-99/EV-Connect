package com.evconnect.backend.config;

import com.evconnect.backend.model.SlotStatus;
import com.evconnect.backend.model.Station;
import com.evconnect.backend.repository.SlotStatusRepository;
import com.evconnect.backend.repository.StationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@Order(1) // Run first before UsageHistorySeeder
public class DataSeeder implements CommandLineRunner {

    private final StationRepository stationRepository;
    private final SlotStatusRepository slotStatusRepository;

    public DataSeeder(StationRepository stationRepository, SlotStatusRepository slotStatusRepository) {
        this.stationRepository = stationRepository;
        this.slotStatusRepository = slotStatusRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (stationRepository.count() > 0) {
            System.out.println("DataSeeder: Stations table already populated (" + stationRepository.count() + " stations). Skipping seeding.");
            return;
        }

        System.out.println("DataSeeder: Seeding 18 charging stations in Bangalore...");

        List<StationData> seedData = Arrays.asList(
            new StationData("Tata Power EZ Charge - Forum Rex Walk", "Tata Power EZ Charge", "Bangalore", 12.9723, 77.6081, Arrays.asList("CCS2", "Type 2 AC"), new BigDecimal("16.50"), 6, "Brigade Road, Ashok Nagar, Bengaluru, Karnataka 560001"),
            new StationData("Statiq Charging Hub - Indiranagar 100ft", "Statiq", "Bangalore", 12.9784, 77.6408, Arrays.asList("CCS2", "Bharat DC-001", "Type 2 AC"), new BigDecimal("14.00"), 8, "100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038"),
            new StationData("ChargeZone Hub - Forum Mall Koramangala", "ChargeZone", "Bangalore", 12.9345, 77.6111, Arrays.asList("CCS2", "Type 2 AC"), new BigDecimal("15.50"), 6, "Hosur Rd, Koramangala 7th Block, Bengaluru, Karnataka 560095"),
            new StationData("Ather Grid - Cyber Park Electronic City", "Ather Grid", "Bangalore", 12.8399, 77.6649, Arrays.asList("Type 2 AC", "Bharat AC-001"), new BigDecimal("11.00"), 4, "Electronic City Phase 1, Bengaluru, Karnataka 560100"),
            new StationData("Tata Power EZ Charge - ITPL Whitefield", "Tata Power EZ Charge", "Bangalore", 12.9863, 77.7381, Arrays.asList("CCS2", "Bharat DC-001", "Type 2 AC"), new BigDecimal("17.00"), 8, "International Tech Park, Whitefield, Bengaluru, Karnataka 560066"),
            new StationData("Statiq Charging Station - HSR Layout 27th Main", "Statiq", "Bangalore", 12.9116, 77.6474, Arrays.asList("CCS2", "Bharat DC-001", "Bharat AC-001"), new BigDecimal("13.50"), 6, "27th Main Rd, Sector 1, HSR Layout, Bengaluru, Karnataka 560102"),
            new StationData("ChargeZone - EcoWorld Bellandur", "ChargeZone", "Bangalore", 12.9257, 77.6835, Arrays.asList("CCS2", "Type 2 AC"), new BigDecimal("18.00"), 6, "RMZ Ecoworld, Devarabesanahalli, Bellandur, Bengaluru, Karnataka 560103"),
            new StationData("Ather Grid - Orion Mall Rajajinagar", "Ather Grid", "Bangalore", 13.0112, 77.5550, Arrays.asList("Type 2 AC", "Bharat AC-001"), new BigDecimal("9.50"), 4, "Dr Rajkumar Rd, Rajajinagar, Bengaluru, Karnataka 560055"),
            new StationData("Tata Power EZ Charge - MG Road Metro Station", "Tata Power EZ Charge", "Bangalore", 12.9756, 77.6067, Arrays.asList("CCS2", "Type 2 AC"), new BigDecimal("16.00"), 4, "Mahatma Gandhi Rd, Bengaluru, Karnataka 560001"),
            new StationData("Statiq - Phoenix Marketcity Whitefield", "Statiq", "Bangalore", 12.9959, 77.6963, Arrays.asList("CCS2", "Bharat DC-001", "Type 2 AC"), new BigDecimal("15.00"), 8, "Whitefield Main Rd, Devasandra Industrial Estate, Bengaluru, Karnataka 560048"),
            new StationData("ChargeZone - Embassy GolfLinks Domlur", "ChargeZone", "Bangalore", 12.9550, 77.6480, Arrays.asList("CCS2", "Type 2 AC"), new BigDecimal("17.50"), 6, "Off Intermediate Ring Rd, Domlur, Bengaluru, Karnataka 560071"),
            new StationData("Ather Grid - Jayanagar 4th Block", "Ather Grid", "Bangalore", 12.9298, 77.5826, Arrays.asList("Type 2 AC", "Bharat AC-001"), new BigDecimal("8.50"), 4, "4th Block, Jayanagar, Bengaluru, Karnataka 560011"),
            new StationData("Tata Power EZ Charge - Manyata Tech Park Hebbal", "Tata Power EZ Charge", "Bangalore", 13.0450, 77.6200, Arrays.asList("CCS2", "Bharat DC-001", "Type 2 AC"), new BigDecimal("16.50"), 8, "Nagavara, Hebbal, Outer Ring Rd, Bengaluru, Karnataka 560045"),
            new StationData("Statiq - UB City Lavelle Road", "Statiq", "Bangalore", 12.9719, 77.5958, Arrays.asList("CCS2", "Type 2 AC"), new BigDecimal("18.00"), 6, "Vittal Mallya Rd, Bengaluru, Karnataka 560001"),
            new StationData("ChargeZone - Malleshwaram 8th Main", "ChargeZone", "Bangalore", 12.9980, 77.5710, Arrays.asList("CCS2", "Bharat AC-001"), new BigDecimal("12.50"), 4, "8th Main Rd, Malleshwaram, Bengaluru, Karnataka 560003"),
            new StationData("Ather Grid - Sarjapur Road Hub", "Ather Grid", "Bangalore", 12.9100, 77.6750, Arrays.asList("Type 2 AC", "Bharat AC-001"), new BigDecimal("10.00"), 4, "Sarjapur - Marathahalli Rd, Bengaluru, Karnataka 560035"),
            new StationData("Tata Power EZ Charge - Marathahalli Bridge", "Tata Power EZ Charge", "Bangalore", 12.9560, 77.7010, Arrays.asList("CCS2", "Type 2 AC", "Bharat DC-001"), new BigDecimal("14.50"), 6, "Outer Ring Rd, Marathahalli, Bengaluru, Karnataka 560037"),
            new StationData("Statiq Charging Hub - BTM Layout 2nd Stage", "Statiq", "Bangalore", 12.9166, 77.6101, Arrays.asList("CCS2", "Bharat DC-001"), new BigDecimal("13.00"), 6, "16th Main Rd, BTM 2nd Stage, Bengaluru, Karnataka 560076")
        );

        Random random = new Random(42);

        for (StationData data : seedData) {
            Station station = new Station(
                data.name, data.network, data.city, data.latitude, data.longitude,
                data.connectorTypes, data.pricePerKwh, data.totalSlots, data.address
            );
            Station savedStation = stationRepository.save(station);

            List<SlotStatus> slots = new ArrayList<>();
            for (int i = 1; i <= data.totalSlots; i++) {
                double rand = random.nextDouble();
                String status;
                if (rand < 0.55) {
                    status = "available";
                } else if (rand < 0.85) {
                    status = "busy";
                } else {
                    status = "full";
                }
                SlotStatus slot = new SlotStatus(savedStation, i, status);
                slots.add(slotStatusRepository.save(slot));
            }
            savedStation.setSlots(slots);
        }

        System.out.println("DataSeeder: Successfully seeded 18 Bangalore stations and slot statuses!");
    }

    private static class StationData {
        String name;
        String network;
        String city;
        Double latitude;
        Double longitude;
        List<String> connectorTypes;
        BigDecimal pricePerKwh;
        Integer totalSlots;
        String address;

        StationData(String name, String network, String city, Double latitude, Double longitude,
                    List<String> connectorTypes, BigDecimal pricePerKwh, Integer totalSlots, String address) {
            this.name = name;
            this.network = network;
            this.city = city;
            this.latitude = latitude;
            this.longitude = longitude;
            this.connectorTypes = connectorTypes;
            this.pricePerKwh = pricePerKwh;
            this.totalSlots = totalSlots;
            this.address = address;
        }
    }
}
