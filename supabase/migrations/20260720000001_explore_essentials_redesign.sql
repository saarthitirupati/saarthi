-- Migration for Server-Driven UI tables
-- Creates decision_cards, experiences, and search_aliases

CREATE TABLE decision_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    query_params JSONB NOT NULL,
    priority INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE search_aliases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alias TEXT NOT NULL UNIQUE,
    maps_to TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default data
INSERT INTO decision_cards (title, icon, query_params, priority) VALUES
('I only have 2 hours', 'Clock', '{"duration": "<120"}', 10),
('I''m with family', 'Users', '{"tags": ["Family"]}', 20),
('It''s raining', 'CloudRain', '{"indoor": true}', 30),
('It''s too hot outside', 'Sun', '{"indoor": true}', 40);

INSERT INTO experiences (title, icon, priority) VALUES
('Spiritual', 'Heart', 10),
('Nature', 'TreePine', 20),
('History', 'Landmark', 30),
('Temple', 'Building', 40),
('Family', 'Users', 50),
('Hidden Gems', 'Sparkles', 60);

INSERT INTO search_aliases (alias, maps_to) VALUES
('phone', 'Mobile Deposit'),
('food', 'Annaprasadam'),
('locker', 'Luggage Counter'),
('shoes', 'Footwear Counter'),
('baby', 'Baby Care'),
('toilet', 'Restroom');
