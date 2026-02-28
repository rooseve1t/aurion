from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from app.core.database import Base

class SmartDevice(Base):
    __tablename__ = "smart_home_devices"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_id = Column(String, unique=True, index=True)
    name = Column(String)
    type = Column(String)
    status = Column(String)
    value = Column(String, nullable=True)
    metadata = Column(JSON, nullable=True)
    integration_provider = Column(String)
