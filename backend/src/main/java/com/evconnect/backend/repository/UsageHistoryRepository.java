package com.evconnect.backend.repository;

import com.evconnect.backend.model.UsageHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsageHistoryRepository extends JpaRepository<UsageHistory, Long> {
    List<UsageHistory> findByStationId(Long stationId);

    @Query("SELECT u.hourOfDay, AVG(u.occupancyPct) FROM UsageHistory u WHERE u.stationId = :stationId GROUP BY u.hourOfDay ORDER BY u.hourOfDay ASC")
    List<Object[]> findAverageOccupancyByHour(@Param("stationId") Long stationId);
}
