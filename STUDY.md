# EVConnect India — Complete Project Study & Presentation Guide

> **Author**: Developer & Presentation Notes  
> **Target Use Case**: Hackathons, Project Presentations, Technical Vivas, and Code Walkthroughs  
> **Format**: PDF-Optimized Standard Markdown

---

## Table of Contents

1. [Project Overview & Hackathon Pitch](#1-project-overview--hackathon-pitch)
2. [Key Industry Problem & The "EVConnect Solution"](#2-key-industry-problem--the-evconnect-solution)
3. [High-Level Technical Terms & Concepts](#3-high-level-technical-terms--concepts)
4. [System Architecture & Data Flow](#4-system-architecture--data-flow)
5. [Core Algorithms & Mathematical Logic](#5-core-algorithms--mathematical-logic)
6. [Database & Entity Schema Design](#6-database--entity-schema-design)
7. [API Endpoints Cheat Sheet](#7-api-endpoints-cheat-sheet)
8. [Frontend Visual Identity & UX Design](#8-frontend-visual-identity--ux-design)
9. [Presentation & Q&A Defense Guide](#9-presentation--qa-defense-guide)
10. [Local Running & Quick Commands](#10-local-running--quick-commands)

---

## 1. Project Overview & Hackathon Pitch

### 1.1 The 30-Second Elevator Pitch
> *"India has over 1.4 million Electric Vehicles on the road, but only about 12,000 public charging stations. The real problem facing EV drivers isn't finding a charger—it's arriving at a charger only to discover a 45-minute line of waiting cars. EVConnect India is a predictive EV charging intelligence platform that ranks stations by real-time availability, forecasts queue wait times, lets users reserve slots in advance, and plans multi-stop trips using real road geometry."*

### 1.2 Elevator Metrics & Key Facts
- **Target Geography**: Bangalore, India (Seeded with 18 real-world stations across major tech corridors like Koramangala, Indiranagar, Whitefield, and Electronic City).
- **Supported Networks**: Tata Power EZ Charge, Statiq, ChargeZone, Ather Grid.
- **Tech Stack**: Spring Boot 3 (Java 17), React 19 + Vite, Leaflet.js, OSRM Routing Engine, Tailwind CSS.

---

## 2. Key Industry Problem & The "EVConnect Solution"

### 2.1 The Two Anxieties of EV Drivers

1. **Range Anxiety (The Old Problem)**:  
   *Definition*: The fear that an electric vehicle will run out of battery before reaching a charging station.  
   *Status*: Largely addressed by legacy map apps (Google Maps) showing pin drops of charger locations.

2. **Queue & Wait Anxiety (The Real Problem)**:  
   *Definition*: The uncertainty of whether a public charging station will have an open plug upon arrival or require an unpredictable wait in line.  
   *Status*: Unaddressed by static mapping tools. **This is what EVConnect India solves.**

### 2.2 Functional Comparison Matrix

| Feature | Standard Map Apps | EVConnect India |
|---|---|---|
| **Station Discovery** | Static Location Pin | Dynamic Rank by Distance + Open Slots |
| **Status Telemetry** | "Charger Exists" | Live Available / Busy / Reserved Port Ratio |
| **Wait-Time Intelligence** | None | Predicted Wait in Minutes (ML/Statistical) |
| **Commute Insights** | None | 24-Hour Peak Occupancy Heatmap |
| **Slot Guarantee** | Arrive & Hope | Pre-book Slot with Instant Reference Code |
| **Trip Planning** | Straight-line radius | OSRM Real Road Polyline + Battery Match |

---

## 3. High-Level Technical Terms & Concepts

Here are the primary technical terms used in the project, explained simply for presentation and interview purposes:

### 1. Telemetry / Telematics
- **Meaning**: Automatically measuring and transmitting data from remote sensors or equipment in real time.
- **In EVConnect**: Simulated background pings `@Scheduled(fixedRate = 30000)` that report live charging port occupancy across Bangalore stations.

### 2. OSRM (Open Source Routing Machine)
- **Meaning**: A high-performance C++ routing engine for calculating shortest/fastest paths on OpenStreetMap road networks.
- **In EVConnect**: Used in the Trip Planner to fetch actual road polyline coordinates and real driving distances instead of estimated straight lines.

### 3. Heuristic / Weighted Scoring
- **Meaning**: An algorithmic approach that combines multiple criteria (e.g., distance, availability, price) using weights to calculate a single unified ranking score.
- **In EVConnect**: Calculates **Nearest Available** score: `Score = (W_d * DistanceScore) + (W_a * AvailabilityRatio)`.

### 4. OCPI (Open Charge Point Interface Protocol)
- **Meaning**: An open international standard protocol that allows different EV charging networks to exchange station status, pricing, and session data seamlessly.
- **In EVConnect**: The backend domain models are structured to mirror OCPI data standards.

### 5. Constructivist Design System
- **Meaning**: An industrial, high-contrast user interface style characterized by hard edges, solid offset shadows, sharp rectangular cards, and zero soft gradients or pill buttons.
- **In EVConnect**: Inspired by transit wayfinding systems using Paper (`#F7F6F1`) and Ink (`#141410`) color palettes.

---

## 4. System Architecture & Data Flow

### 4.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER (React 19 + Vite)                  │
│  - Landing Page (Hero, Stats, Pitch)   - Station Finder (Map + Cards)    │
│  - Vehicle Selector Segmented Control  - Station Detail + Peak Heatmap   │
│  - Instant Booking Ticket Modal        - Multi-Stop OSRM Trip Planner    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP REST / JSON
┌────────────────────────────────────▼────────────────────────────────────┐
│                       BACKEND LAYER (Spring Boot 3)                     │
│  - StationController (Discovery API)  - BookingController (Reservation) │
│  - TripPlannerController (OSRM Route) - SlotSimulatorScheduler (Pings)  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ JPA / Hibernate
┌────────────────────────────────────▼────────────────────────────────────┐
│                      PERSISTENCE & EXTERNAL SERVICES                    │
│  - Database: H2 (Dev) / Neon PostgreSQL (Prod)                          │
│  - External API: OSRM Routing Engine (router.project-osrm.org)          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Data Flow Walkthrough
1. **App Startup**: `DataSeeder` inserts 18 realistic Bangalore stations and populates `UsageHistory` with 24-hour occupancy patterns.
2. **Live Telemetry**: `SlotSimulatorScheduler` runs every 30 seconds to randomly update unreserved slot statuses (modelling real cars plugging in and unplugging).
3. **User Booking**: A user selects a station and slot, submitting a reservation. The backend locks the slot (`status = RESERVED`) and returns a unique reference code (`EVC-BLR-XXXX`). The scheduler respects the lock and will not flip reserved slots.
4. **Trip Routing**: User inputs origin & destination. Backend queries OSRM for actual road geometry, compares total trip distance against vehicle battery range, and suggests optimal charging stops if needed.

---

## 5. Core Algorithms & Mathematical Logic

### 5.1 Nearest Available Scoring Formula
When a user clicks **"Find Nearest Available"**, the algorithm calculates a composite score $S$ for each station:

$$S = \left( 100 - (\text{DistanceInKm} \times 3) \right) + \left( \frac{\text{AvailableSlots}}{\text{TotalSlots}} \times 50 \right) - \text{ZeroSlotPenalty}$$

- **Goal**: Highlight stations that are close *and* actually have open slots, avoiding sending drivers to full stations.

### 5.2 Wait-Time Prediction Formula
For busy or full stations, estimated queue wait time $W$ (in minutes) is calculated as:

$$W = \left( \frac{\text{Occupied Slots}}{\text{Total Slots}} \right) \times \text{BaseSessionTime} \times \text{PeakMultiplier}(H)$$

- **BaseSessionTime**: 30 minutes (average fast-charge duration to 80%).
- **PeakMultiplier(H)**:
  - Morning Peak (8:00 AM – 10:00 AM): **1.6×**
  - Evening Peak (6:00 PM – 9:00 PM): **1.8×**
  - Off-Peak Hours: **1.0×**

---

## 6. Database & Entity Schema Design

The project uses 4 core JPA Entities:

### 1. `Station`
Stores physical location, operator network, pricing, and slot totals.
- `id` (Long, PK)
- `name` (String, e.g., "Tata Power EZ Charge - Forum Rex Walk")
- `network` (String, e.g., "Tata Power", "Statiq", "Ather Grid")
- `latitude`, `longitude` (Double)
- `pricePerKwh` (Double)
- `totalSlots` (Integer)

### 2. `SlotStatus`
Tracks real-time individual charging ports per station.
- `id` (Long, PK)
- `stationId` (Long, FK)
- `slotNumber` (Integer)
- `status` (Enum: `AVAILABLE`, `BUSY`, `RESERVED`, `FULL`)

### 3. `Booking`
Manages driver slot reservations.
- `id` (Long, PK)
- `bookingReferenceCode` (String, e.g., `EVC-BLR-6993`)
- `stationId`, `slotId` (Long)
- `customerName`, `vehicleType` (String)
- `bookingTime` (LocalDateTime)
- `durationMinutes` (Integer)
- `status` (String: `CONFIRMED`, `CANCELLED`)

### 4. `UsageHistory`
Stores 24x7 historical hourly occupancy logs for prediction.
- `id` (Long, PK)
- `stationId` (Long)
- `hourOfDay` (Integer: 0–23)
- `occupancyPercentage` (Double)

---

## 7. API Endpoints Cheat Sheet

| HTTP Method | Endpoint Path | Description | Key Parameters / Body |
|---|---|---|---|
| `GET` | `/api/stations` | Fetch all stations | None |
| `GET` | `/api/stations/nearest` | Fetch nearest available | `lat`, `lng`, `maxDistanceKm` |
| `GET` | `/api/stations/{id}` | Station details + slots | `{id}` in path |
| `GET` | `/api/stations/{id}/wait-time` | Predicted wait time | `{id}` in path |
| `GET` | `/api/stations/{id}/peak-hours` | 24h occupancy trend | `{id}` in path |
| `POST` | `/api/bookings` | Create slot reservation | `{ stationId, slotId, customerName, vehicleType }` |
| `POST` | `/api/trip-plan` | Plan multi-stop trip | `{ startLocation, destLocation, vehicleType }` |

---

## 8. Frontend Visual Identity & UX Design

### 8.1 The "Constructivist" Visual Language
The interface moves away from generic dark neon themes and adopts a **paper-and-ink transit wayfinding style**:

- **Paper Background**: `#F7F6F1` (Off-white, soft on eyes)
- **Ink Black**: `#141410` (Sharp text & 2px solid borders)
- **Transit Green**: `#146B3A` (Available slots & positive CTAs)
- **Hazard Amber**: `#D98E04` (Busy slots & warnings)
- **Rust Red**: `#B23A2E` (Full slots & errors)

### 8.2 Design Signature Elements
1. **Hard Offset Shadows**: Rectangular cards and buttons feature `3px 3px 0 #141410` hard offset shadows that collapse on button click (`active:translate-x-[3px] active:translate-y-[3px]`).
2. **Voltage Stripe Band**: A 6px diagonal repeating stripe (`voltage-stripe`) used for section breaks and active loading progress indicators.
3. **Custom Flag Map Pins**: Map pins are styled as rectangular DOM flags with live free-slot ratios (`3/6`) rendered directly over CartoDB Positron maps.

---

## 9. Presentation & Q&A Defense Guide

### Likely Presentation / Viva Questions & Model Answers

#### Q1: "How is your app different from Google Maps or PlugShare?"
> **Answer**: *"Google Maps shows static charger locations. PlugShare relies on manual crowd-sourced check-ins. EVConnect India provides real-time port telemetry, mathematical wait-time predictions based on rush-hour traffic data, pre-arrival slot reservations with reference IDs, and route range matching via OSRM."*

#### Q2: "How does the backend simulate real-time slot changes?"
> **Answer**: *"We use Spring Boot's `@Scheduled` annotation running a background task every 30 seconds. It simulates vehicle arrivals/departures while enforcing a safety lock so active user bookings (`RESERVED` status) are never overwritten."*

#### Q3: "How does the Trip Planner calculate road distance?"
> **Answer**: *"We integrate with OpenSource Routing Machine (OSRM) REST API. Instead of straight-line Haversine approximations, we retrieve real road polyline geometry, compare total driving distance against vehicle battery capacity, and inject suggested charging stops if distance exceeds 70% of vehicle range."*

---

## 10. Local Running & Quick Commands

### Start Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run   # Windows
# or ./mvnw spring-boot:run  # macOS/Linux
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access Application
Open Browser at: **`http://localhost:5173`**
