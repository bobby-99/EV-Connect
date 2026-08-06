package com.evconnect.backend.dto;

import java.util.List;

public class StationDetailDto extends StationSummaryDto {
    private List<SlotStatusDto> slots;

    public StationDetailDto() {
        super();
    }

    public List<SlotStatusDto> getSlots() { return slots; }
    public void setSlots(List<SlotStatusDto> slots) { this.slots = slots; }
}
