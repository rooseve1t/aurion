import edge_tts
import asyncio
import base64
import aiohttp
from typing import Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class CosyVoice2TTS:
    """Реальная интеграция с CosyVoice2 API (предположим, есть локальный endpoint)"""
    def __init__(self, api_url: str = "http://localhost:5001/synthesize"):
        self.api_url = api_url

    async def synthesize(self, text: str, emotion: str = "neutral") -> bytes:
        try:
            async with aiohttp.ClientSession() as session:
                payload = {"text": text, "emotion": emotion}
                async with session.post(self.api_url, json=payload) as resp:
                    if resp.status == 200:
                        return await resp.read()
                    else:
                        logger.error(f"CosyVoice2 error: {resp.status}")
                        return b""
        except Exception as e:
            logger.error(f"CosyVoice2 exception: {e}")
            return b""

class TTSService:
    def __init__(self):
        # Приоритет: CosyVoice2 (быстрый), если доступен, иначе edge-tts
        self.fast_tts = CosyVoice2TTS()  # предполагаем, что сервис запущен локально

    async def synthesize(self, text: str, emotion: str = "neutral", use_fast: bool = True) -> bytes:
        if use_fast:
            audio = await self.fast_tts.synthesize(text, emotion)
            if audio:
                return audio
            logger.warning("Fast TTS failed, falling back to edge-tts")
        communicate = edge_tts.Communicate(text, "ru-RU-DariyaNeural")
        audio = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio += chunk["data"]
        return audio
