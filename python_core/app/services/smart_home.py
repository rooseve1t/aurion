import asyncio
import json
from asyncio_mqtt import Client, MqttError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class SmartHomeManager:
    def __init__(self):
        self.mqtt_broker = settings.MQTT_BROKER
        self.mqtt_port = settings.MQTT_PORT
        self.mqtt_user = settings.MQTT_USERNAME
        self.mqtt_pass = settings.MQTT_PASSWORD
        # Здесь можно инициализировать адаптеры для других протоколов

    async def control_light(self, device_id: str, action: str, brightness: int = None) -> str:
        # Пытаемся через MQTT
        if self.mqtt_broker:
            try:
                async with Client(self.mqtt_broker, port=self.mqtt_port,
                                  username=self.mqtt_user, password=self.mqtt_pass) as client:
                    topic = f"home/{device_id}/set"
                    payload = {"state": action}
                    if brightness is not None:
                        payload["brightness"] = brightness
                    await client.publish(topic, payload=json.dumps(payload))
                    logger.info(f"MQTT command sent to {device_id}: {action}")
                    return f"Команда отправлена устройству {device_id}"
            except MqttError as e:
                logger.error(f"MQTT error: {e}")
                return f"Ошибка MQTT: {e}"
        else:
            return "MQTT не настроен."

    # Здесь можно добавить методы для других типов устройств
