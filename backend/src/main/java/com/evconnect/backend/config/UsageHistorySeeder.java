package com.evconnect.backend.config;

import com.evconnect.backend.model.Station;
import com.evconnect.backend.model.UsageHistory;
import com.evconnect.backend.repository.StationRepository;
import com.evconnect.backend.repository.UsageHistoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Order(2) // Run after DataSeeder (which has Order 1 or default)
public class UsageHistorySeeder implements CommandLineRunner {

    private final StationRepository stationRepository;
    private final UsageHistoryRepository usageHistoryRepository;

    public UsageHistorySeeder(StationRepository stationRepository, UsageHistoryRepository usageHistoryRepository) {
        this.stationRepository = stationRepository;
        this.usageHistoryRepository = usageHistoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (usageHistoryRepository.count() > 0) {
            System.out.println("UsageHistorySeeder: Table already populated (" + usageHistoryRepository.count() + " records). Skipping.");
            return;
        }

        List<Station> stations = stationRepository.findAll();
        if (stations.isEmpty()) {
            System.out.println("UsageHistorySeeder: No stations found. Skipping.");
            return;
        }

        System.out.println("UsageHistorySeeder: Generating historical usage pattern across 7 days x 24 hours for " + stations.size() + " stations...");

        Random random = new Random(100); // Fixed seed for reproducible realistic patterns
        List<UsageHistory> records = new ArrayList<>();

        for (Station station : stations) {
            // Give each station a slight characteristic offset (-5% to +5%) based on location
            double stationFactor = 0.95 + (random.nextDouble() * 0.10);

            for (int day = 0; day < 7; day++) { // 0 = Monday, 6 = Sunday
                boolean isWeekend = (day == 5 || day == 6);

                for (int hour = 0; hour < 24; hour++) {
                    double baseOccupancy;

                    if (!isWeekend) {
                        // Weekday commute & lunch profile (Mon-Fri)
                        if (hour >= 8 && hour <= 10) {
                            // Morning Peak Rush (8-10 AM)
                            baseOccupancy = 78.0 + random.nextDouble() * 17.0; // 78% - 95%
                        } else if (hour >= 18 && hour <= 21) {
                            // Evening Peak Rush (6-9 PM)
                            baseOccupancy = 82.0 + random.nextDouble() * 16.0; // 82% - 98%
                        } else if (hour >= 12 && hour <= 14) {
                            // Midday Lunch Spike (12-2 PM)
                            baseOccupancy = 58.0 + random.nextDouble() * 18.0; // 58% - 76%
                        } else if (hour >= 23 || hour <= 5) {
                            // Late Night (11 PM - 5 AM)
                            baseOccupancy = 10.0 + random.nextDouble() * 15.0; // 10% - 25%
                        } else {
                            // Regular Off-peak (6-7 AM, 10-12 AM, 2-6 PM, 9-11 PM)
                            baseOccupancy = 38.0 + random.nextDouble() * 22.0; // 38% - 60%
                        }
                    } else {
                        // Weekend profile (Sat-Sun): flatter, leisure & afternoon outings
                        if (hour >= 12 && hour <= 18) {
                            baseOccupancy = 45.0 + random.nextDouble() * 25.0; // 45% - 70%
                        } else if (hour >= 22 || hour <= 6) {
                            baseOccupancy = 8.0 + random.nextDouble() * 12.0;  // 8% - 20%
                        } else {
                            baseOccupancy = 25.0 + random.nextDouble() * 25.0; // 25% - 50%
                        }
                    }

                    // Apply station factor & clamp to 0..100%
                    double finalOccupancy = Math.min(100.0, Math.max(0.0, baseOccupancy * stationFactor));
                    BigDecimal roundedPct = BigDecimal.valueOf(finalOccupancy).setScale(2, RoundingMode.HALF_UP);

                    records.add(new UsageHistory(station.getId(), hour, day, roundedPct));
                }
            }
        }

        usageHistoryRepository.saveAll(records);
        System.out.println("UsageHistorySeeder: Successfully seeded " + records.size() + " historical usage records!");
    }
}
