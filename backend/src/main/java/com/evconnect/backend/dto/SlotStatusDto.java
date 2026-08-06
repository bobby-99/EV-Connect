package com.evconnect.backend.dto;

import java.time.LocalDateTime;

public class SlotStatusDto {
    private Long id;
    private Integer slotNumber;
    private String status;
    private LocalDateTime updatedAt;

    public SlotStatusDto() {}

    public SlotStatusDto(Long id, Integer slotNumber, String status, LocalDateTime updatedAt) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.status = status;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getSlotNumber() { return slotNumber; }
    public void setSlotNumber(Integer slotNumber) { this.slotNumber = slotNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
