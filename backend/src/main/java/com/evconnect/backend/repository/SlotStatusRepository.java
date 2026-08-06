package com.evconnect.backend.repository;

import com.evconnect.backend.model.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SlotStatusRepository extends JpaRepository<SlotStatus, Long> {
    List<SlotStatus> findByStationId(Long stationId);
}
