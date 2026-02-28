from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base
from pgvector.sqlalchemy import Vector

class MemoryEntry(Base):
    __tablename__ = "memory_entries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    content = Column(Text)
    embedding = Column(Vector(384))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
