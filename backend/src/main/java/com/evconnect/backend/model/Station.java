package com.evconnect.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stations")
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", length = 150)
    private String name;

    @Column(name = "network", length = 100)
    private String network;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Convert(converter = StringListConverter.class)
    @Column(name = "connector_types", columnDefinition = "TEXT")
    private List<String> connectorTypes = new ArrayList<>();

    @Column(name = "price_per_kwh", precision = 5, scale = 2)
    private BigDecimal pricePerKwh;

    @Column(name = "total_slots")
    private Integer totalSlots;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<SlotStatus> slots = new ArrayList<>();

    public Station() {
    }

    public Station(String name, String network, String city, Double latitude, Double longitude,
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNetwork() { return network; }
    public void setNetwork(String network) { this.network = network; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public List<String> getConnectorTypes() { return connectorTypes; }
    public void setConnectorTypes(List<String> connectorTypes) { this.connectorTypes = connectorTypes; }

    public BigDecimal getPricePerKwh() { return pricePerKwh; }
    public void setPricePerKwh(BigDecimal pricePerKwh) { this.pricePerKwh = pricePerKwh; }

    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public List<SlotStatus> getSlots() { return slots; }
    public void setSlots(List<SlotStatus> slots) { this.slots = slots; }
}
