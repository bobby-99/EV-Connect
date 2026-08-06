package com.evconnect.backend.config;

import java.util.HashMap;
import java.util.Map;

public class VehicleRangeRegistry {

    private static final Map<String, Double> RANGE_MAP = new HashMap<>();

    static {
        RANGE_MAP.put("Tata Nexon EV", 275.0);
        RANGE_MAP.put("MG ZS EV", 461.0);
        RANGE_MAP.put("Tata Tiago EV", 180.0);
        RANGE_MAP.put("Ola S1 Pro", 135.0);
        RANGE_MAP.put("Ather 450X", 100.0);
        RANGE_MAP.put("Mahindra XUV400", 260.0);
    }

    public static double getVehicleRange(String vehicleType) {
        if (vehicleType == null || vehicleType.trim().isEmpty()) {
            return 250.0;
        }
        for (Map.Entry<String, Double> entry : RANGE_MAP.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(vehicleType.trim())) {
                return entry.getValue();
            }
        }
        return 250.0; // Default EV range benchmark in km
    }
}
