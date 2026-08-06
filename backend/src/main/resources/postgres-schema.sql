-- EVConnect India PostgreSQL Schema

CREATE TABLE IF NOT EXISTS stations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  network VARCHAR(100),
  city VARCHAR(100),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  connector_types TEXT[],
  price_per_kwh NUMERIC(5,2),
  total_slots INT,
  address TEXT
);

CREATE TABLE IF NOT EXISTS slot_status (
  id SERIAL PRIMARY KEY,
  station_id INT REFERENCES stations(id),
  slot_number INT,
  status VARCHAR(20),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_history (
  id SERIAL PRIMARY KEY,
  station_id INT REFERENCES stations(id),
  hour_of_day INT,
  day_of_week INT,
  occupancy_pct NUMERIC(5,2)
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_reference_code VARCHAR(50),
  station_id INT REFERENCES stations(id),
  slot_id INT REFERENCES slot_status(id),
  customer_name VARCHAR(100),
  vehicle_type VARCHAR(50),
  booking_time TIMESTAMP,
  duration_minutes INT,
  status VARCHAR(20) DEFAULT 'confirmed'
);
