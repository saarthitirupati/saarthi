import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, text
from sqlalchemy.dialects.postgresql import UUID

class BaseMixin:
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
