from sqlalchemy import Column, String, Integer, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    city_id = Column(UUID(as_uuid=True), nullable=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    icon = Column(String, nullable=True)
    priority = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))

    places = relationship("Place", back_populates="category")
