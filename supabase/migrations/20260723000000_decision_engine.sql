-- Migration: Saarthi Decision Engine v1.0.0 Setup
-- Tables for Configurable Weights and Rules

CREATE TABLE IF NOT EXISTS recommendation_weights (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  weights JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendation_rules (
  id TEXT PRIMARY KEY,
  condition_type TEXT NOT NULL,
  condition_value TEXT NOT NULL,
  target_filter JSONB NOT NULL,
  score_modifier INT NOT NULL,
  reason_template TEXT NOT NULL,
  source_attribution TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Categorized Weights
INSERT INTO recommendation_weights (id, category, weights, description) VALUES
('distance', 'distance', '{"under2km": 35, "under5km": 25, "under10km": 15, "under20km": 5}', 'Distance scoring tiers'),
('crowd', 'crowd', '{"low": 30, "moderate": 15, "high": -15, "extreme": -40}', 'Crowd level weight modifiers'),
('opening', 'opening', '{"open": 30, "closingSoon": -50, "closed": -1000}', 'Opening status scoring modifiers'),
('parking', 'parking', '{"available": 15, "limited": 5, "full": -20}', 'Parking availability modifiers')
ON CONFLICT (id) DO UPDATE SET weights = EXCLUDED.weights, updated_at = NOW();

-- Seed Default Rules
INSERT INTO recommendation_rules (id, condition_type, condition_value, target_filter, score_modifier, reason_template, source_attribution) VALUES
('rule_rain_indoor', 'weather', 'rain', '{"placeType": "indoor"}', 35, 'Indoor facility safe from rain', 'IMD'),
('rule_rain_outdoor', 'weather', 'rain', '{"placeType": "nature"}', -80, 'Heavy rain alert for outdoor area', 'IMD'),
('rule_crowd_escape', 'crowd', 'extreme_crowd', '{"category": "Core Temple"}', 40, 'Foothill escape from hilltop crowds', 'Live Update'),
('rule_morning_shrine', 'time', 'morning', '{"interests": ["spiritual"]}', 25, 'Morning is ideal for spiritual darshan', 'Saarthi'),
('rule_night_lights', 'time', 'night', '{"tags": ["Temple Lights"]}', 30, 'Beautifully illuminated at night', 'Saarthi'),
('rule_friday_goddess', 'day', 'friday', '{"id": "padmavathi"}', 30, 'Friday is auspicious for Padmavathi Ammavaru', 'TTD')
ON CONFLICT (id) DO UPDATE SET score_modifier = EXCLUDED.score_modifier;
