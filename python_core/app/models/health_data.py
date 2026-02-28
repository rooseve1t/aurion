from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class HealthData(Base):
    __tablename__ = "health_data"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    heart_rate = Column(Integer, nullable=True)
    sleep_score = Column(Integer, nullable=True)
    stress_level = Column(Integer, nullable=True)
    activity_level = Column(Integer, nullable=True)
    steps = Column(Integer, nullable=True)
    calories = Column(Integer, nullable=True)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
