-- Migration for Saarthi Trip Estimator & Fuel Pricing Engine

-- 1. Fuel Prices Table
CREATE TABLE IF NOT EXISTS fuel_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fuel_type VARCHAR(20) NOT NULL UNIQUE, -- 'petrol', 'diesel', 'cng'
  price NUMERIC(6, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed initial fuel prices for Tirupati region
INSERT INTO fuel_prices (fuel_type, price)
VALUES 
  ('petrol', 108.50),
  ('diesel', 96.20),
  ('cng', 89.00)
ON CONFLICT (fuel_type) DO UPDATE SET price = EXCLUDED.price, updated_at = now();

-- 2. Vehicle Profiles Table
CREATE TABLE IF NOT EXISTS vehicle_profiles (
  id VARCHAR(30) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  category VARCHAR(30) NOT NULL, -- 'bike', 'car', 'auto', 'bus', 'walk'
  avg_speed_kmh NUMERIC(4, 1) NOT NULL,
  fuel_type VARCHAR(20),
  avg_mileage_kml NUMERIC(5, 1),
  parking_type VARCHAR(20) DEFAULT 'paid', -- 'free', 'paid'
  default_parking_fee NUMERIC(6, 2) DEFAULT 0,
  icon VARCHAR(50) DEFAULT 'Car',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed initial vehicle profiles
INSERT INTO vehicle_profiles (id, name, category, avg_speed_kmh, fuel_type, avg_mileage_kml, parking_type, default_parking_fee, icon)
VALUES
  ('bike', 'Motorcycle / Scooter', 'bike', 35.0, 'petrol', 45.0, 'free', 15.0, 'Bike'),
  ('car', 'Standard Sedan / Hatchback', 'car', 30.0, 'petrol', 15.0, 'paid', 40.0, 'Car'),
  ('suv', 'Large SUV / MUV', 'car', 28.0, 'diesel', 11.0, 'paid', 50.0, 'Car'),
  ('auto', 'Auto Rickshaw', 'auto', 25.0, 'cng', 22.0, 'free', 0.0, 'Auto'),
  ('bus', 'APSRTC Bus', 'bus', 22.0, 'diesel', 4.0, 'free', 0.0, 'Bus'),
  ('walk', 'Walking', 'walk', 4.2, NULL, NULL, 'free', 0.0, 'Footprints')
ON CONFLICT (id) DO UPDATE SET 
  avg_speed_kmh = EXCLUDED.avg_speed_kmh,
  avg_mileage_kml = EXCLUDED.avg_mileage_kml,
  default_parking_fee = EXCLUDED.default_parking_fee;

-- 3. Transport Rules Table
CREATE TABLE IF NOT EXISTS transport_rules (
  vehicle_category VARCHAR(30) PRIMARY KEY,
  base_fare NUMERIC(6, 2) NOT NULL DEFAULT 30.0,
  base_km NUMERIC(4, 1) NOT NULL DEFAULT 2.0,
  extra_per_km NUMERIC(6, 2) NOT NULL DEFAULT 15.0,
  minimum_fare NUMERIC(6, 2) NOT NULL DEFAULT 30.0,
  waiting_charge_per_hr NUMERIC(6, 2) DEFAULT 60.0
);

INSERT INTO transport_rules (vehicle_category, base_fare, base_km, extra_per_km, minimum_fare, waiting_charge_per_hr)
VALUES
  ('auto', 30.0, 2.0, 15.0, 30.0, 60.0),
  ('cab', 200.0, 4.0, 18.0, 200.0, 120.0),
  ('suv_cab', 350.0, 4.0, 24.0, 350.0, 150.0)
ON CONFLICT (vehicle_category) DO NOTHING;
