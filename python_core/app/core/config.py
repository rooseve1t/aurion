from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    DATABASE_URL: Optional[str] = None
    SECRET_KEY: str = "aurion-secret-key-12345"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 30
    OPENAI_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    MQTT_BROKER: str = "localhost"
    MQTT_PORT: int = 1883
    MQTT_USERNAME: Optional[str] = None
    MQTT_PASSWORD: Optional[str] = None
    GOOGLE_CREDENTIALS_FILE: Optional[str] = None
    FITBIT_CLIENT_ID: Optional[str] = None
    FITBIT_CLIENT_SECRET: Optional[str] = None

settings = Settings()
