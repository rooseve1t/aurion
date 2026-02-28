import openai
import google.generativeai as genai
from anthropic import Anthropic
from app.core.config import settings
import logging
import asyncio

logger = logging.getLogger(__name__)

class LLMRouter:
    def __init__(self):
        self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.google_available = bool(settings.GOOGLE_API_KEY)
        self.anthropic_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY) if settings.ANTHROPIC_API_KEY else None

    async def ask_general(self, prompt: str, system_prompt: str = None) -> str:
        # Попытка использовать OpenAI, если есть ключ
        if self.openai_client:
            try:
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                response = await self.openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=300
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.error(f"OpenAI error: {e}")
        # Fallback на Gemini
        if self.google_available:
            try:
                model = genai.GenerativeModel('gemini-2.0-flash')
                response = await model.generate_content_async(prompt)
                return response.text
            except Exception as e:
                logger.error(f"Gemini error: {e}")
        # Последний fallback на Anthropic
        if self.anthropic_client:
            try:
                message = await self.anthropic_client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=300,
                    system=system_prompt or "",
                    messages=[{"role": "user", "content": prompt}]
                )
                return message.content[0].text
            except Exception as e:
                logger.error(f"Anthropic error: {e}")
        return "Извините, все LLM-провайдеры временно недоступны."

    async def ask_reasoning(self, prompt: str) -> str:
        # Специализированный метод для сложных рассуждений (используем Gemini Thinking)
        if self.google_available:
            try:
                model = genai.GenerativeModel('gemini-2.0-flash-thinking')
                response = await model.generate_content_async(prompt)
                return response.text
            except Exception as e:
                logger.error(f"Gemini thinking error: {e}")
        return await self.ask_general(prompt, "Ты — эксперт по аналитике. Думай шаг за шагом.")

    async def classify_intent(self, command: str) -> str:
        system_prompt = "Классифицируй команду пользователя как одну из: control_light, open_app, web_search, health_check, general_question. Ответь только названием категории."
        result = await self.ask_general(command, system_prompt)
        # Очистка результата от возможных лишних символов
        result = result.strip().lower()
        valid_intents = ["control_light", "open_app", "web_search", "health_check", "general_question"]
        for intent in valid_intents:
            if intent in result:
                return intent
        return "general_question"

    async def ask_general_with_messages(self, messages: list) -> str:
        # Попытка использовать OpenAI
        if self.openai_client:
            try:
                response = await self.openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=500
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.error(f"OpenAI error: {e}")

        # Fallback на Gemini
        if self.google_available:
            try:
                model = genai.GenerativeModel('gemini-2.0-flash')
                # Преобразование формата сообщений для Gemini
                # (Упрощенно: берем последнее сообщение пользователя)
                last_user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
                response = await model.generate_content_async(last_user_msg)
                return response.text
            except Exception as e:
                logger.error(f"Gemini error: {e}")

        # Fallback на Anthropic
        if self.anthropic_client:
            try:
                # Преобразование формата сообщений для Anthropic
                system_msg = next((m["content"] for m in messages if m["role"] == "system"), "")
                chat_messages = [m for m in messages if m["role"] != "system"]
                message = await self.anthropic_client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=500,
                    system=system_msg,
                    messages=chat_messages
                )
                return message.content[0].text
            except Exception as e:
                logger.error(f"Anthropic error: {e}")

        return "Извините, я не могу сейчас ответить. Попробуйте позже."
