package com.evconnect.backend.service;

import com.evconnect.backend.model.SlotStatus;
import com.evconnect.backend.repository.SlotStatusRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class SlotSimulatorScheduler {

    private final SlotStatusRepository slotStatusRepository;
    private final Random random = new Random();

    public SlotSimulatorScheduler(SlotStatusRepository slotStatusRepository) {
        this.slotStatusRepository = slotStatusRepository;
    }

    /**
     * Toggles 2 to 4 slot statuses randomly every 35 seconds to simulate live charging activity.
     * EXCLUDES active 'reserved' slots so real user bookings are never overwritten by background noise.
     */
    @Scheduled(fixedRate = 35000)
    @Transactional
    public void simulateLiveStatusNudge() {
        List<SlotStatus> candidates = slotStatusRepository.findAll().stream()
                .filter(slot -> slot.getStatus() == null || !"reserved".equalsIgnoreCase(slot.getStatus()))
                .collect(Collectors.toList());

        if (candidates.isEmpty()) {
            return;
        }

        int countToUpdate = Math.min(candidates.size(), 2 + random.nextInt(3)); // 2, 3, or 4 slots
        System.out.println("SlotSimulatorScheduler: Simulating live status update for " + countToUpdate + " non-reserved slots...");

        for (int i = 0; i < countToUpdate; i++) {
            int index = random.nextInt(candidates.size());
            SlotStatus slot = candidates.get(index);

            String currentStatus = slot.getStatus() != null ? slot.getStatus().toLowerCase() : "available";
            String newStatus;

            if ("available".equals(currentStatus)) {
                newStatus = "busy";
            } else if ("busy".equals(currentStatus)) {
                newStatus = random.nextBoolean() ? "available" : "full";
            } else {
                newStatus = "available";
            }

            slot.setStatus(newStatus);
            slot.setUpdatedAt(LocalDateTime.now());
            slotStatusRepository.save(slot);
        }
    }
}
