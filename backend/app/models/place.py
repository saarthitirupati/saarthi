from sqlalchemy import Column, String, Boolean, Text, ForeignKey, DateTime, text, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base

class Place(Base):
    __tablename__ = "places"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    city_id = Column(UUID(as_uuid=True), nullable=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"))
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text)
    history = Column(Text)
    story = Column(Text)
    interesting_facts = Column(JSONB)
    why_visit = Column(ARRAY(String))
    coordinates = Column(JSONB)
    timings = Column(JSONB)
    entry_fee = Column(JSONB)
    visit_duration = Column(JSONB)
    travel_info = Column(JSONB)
    hero_image = Column(String)
    gallery = Column(JSONB)
    media = Column(JSONB)
    tips = Column(ARRAY(String))
    weather_ideal = Column(ARRAY(String))
    best_time = Column(ARRAY(String))
    crowd_escape = Column(Boolean)
    db_metadata = Column("metadata", JSONB)
    verification_status = Column(String)
    verified_by = Column(String)
    verified_on = Column(DateTime(timezone=True))
    last_reviewed = Column(DateTime(timezone=True))
    trust_score = Column(Integer)
    keywords = Column(ARRAY(String))
    featured = Column(Boolean)
    status = Column(String)
    priority = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True))
    
    # Master Template Operational / Classification
    architecture = Column(Text)
    importance = Column(Text)
    deity = Column(Text)
    deityType = Column(Text)
    builtBy = Column(Text)
    keyPoojas = Column(ARRAY(String))
    breakTimings = Column(JSONB)
    isHiddenGem = Column(Boolean)
    rituals = Column(JSONB)
    facilities = Column(JSONB)
    difficulty = Column(String)
    bestSeason = Column(String)
    relatedPlaces = Column(ARRAY(String))
    nearbyTemples = Column(ARRAY(String))
    
    # Extra Array fields
    images = Column(ARRAY(String))
    tags = Column(ARRAY(String))
    isActive = Column(Boolean, default=True)

    category = relationship("Category", back_populates="places")
