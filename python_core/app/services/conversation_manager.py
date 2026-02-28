from typing import List, Dict, Any, Optional
from app.services.llm_router import LLMRouter
from app.services.memory_system import MemorySystem
from app.services.smart_home import SmartHomeManager
from app.services.desktop_control import DesktopControl
from app.agents.orchestrator import AgentOrchestrator
from app.services.decision_engine import DecisionEngine, AutonomyLevel
from app.services.autonomy_manager import AutonomyManager
from sqlalchemy.ext.asyncio import AsyncSession
import json
import logging

logger = logging.getLogger(__name__)

class ConversationManager:
    def __init__(self):
        self.llm = LLMRouter()
        self.memory = MemorySystem()
        self.smart_home = SmartHomeManager()
        self.desktop = DesktopControl()
        self.agent = AgentOrchestrator()
        self.decision_engine = DecisionEngine()
        self.autonomy_manager = AutonomyManager()

    async def process_message(
        self,
        user_id: int,
        message: str,
        conversation_history: List[Dict[str, str]],
        db: AsyncSession
    ) -> str:
        # 1. Обогащаем историю контекстом из памяти
        context = await self._build_context(user_id, db)

        # 2. Определяем, является ли сообщение командой к действию
        intent = await self._classify_intent(message, conversation_history)

        if intent == "command":
            # Выполняем команду через CommandExecutor
            from app.services.voice_executor import CommandExecutor
            executor = CommandExecutor()
            result = await executor.execute_command(db, user_id, message, conversation_history=conversation_history)
            return result["result"]
        else:
            # Обычный диалог
            return await self._generate_response(message, conversation_history, context)

    async def _classify_intent(self, message: str, history: List[Dict]) -> str:
        # Используем LLM для определения интента
        prompt = f"""Ты – система классификации запросов для ассистента Джарвис.
Определи, является ли следующее сообщение пользователя командой к действию (например, управление домом, поиск, открытие приложения) или обычным разговорным сообщением (вопрос, шутка, общение).
Если сообщение содержит просьбу что-то сделать (включить свет, найти в интернете, открыть программу, напомнить), ответь "command". Иначе ответь "chat".

Сообщение: {message}
История (последние 2 сообщения): {history[-2:] if history else "Нет истории"}
Ответ (только слово command или chat):"""
        response = await self.llm.ask_general(prompt, temperature=0)
        return response.strip().lower()

    async def _generate_response(self, message: str, history: List[Dict], context: str) -> str:
        system_prompt = self._build_system_prompt(context)
        # Формируем историю в формате для LLM
        messages = [{"role": "system", "content": system_prompt}]
        for turn in history[-10:]:  # последние 10 сообщений
            messages.append({"role": turn["role"], "content": turn["content"]})
        messages.append({"role": "user", "content": message})

        response = await self.llm.ask_general_with_messages(messages)
        return response

    def _build_system_prompt(self, context: str) -> str:
        base = """Ты – Джарвис, высокоинтеллектуальный AI-ассистент из вселенной Marvel. Твой характер:
- Остроумный, вежливый, слегка саркастичный (но добродушно).
- Всегда готов помочь, но можешь подшутить над пользователем (Тони Старком) в рамках дружеского общения.
- Ты отвечаешь кратко и по делу, но можешь поддержать любую тему – от науки до повседневных вопросов.
- Если пользователь просит что-то сделать (включить свет, найти информацию), ты либо делаешь это, либо сообщаешь о результате.
- Ты помнишь предыдущие разговоры и факты о пользователе.

Контекст о пользователе (из памяти): {context}
"""
        return base.format(context=context)

    async def _build_context(self, user_id: int, db: AsyncSession) -> str:
        # Получаем факты из памяти (имя, предпочтения)
        # В MemorySystem пока нет get_user_facts, добавим его позже
        try:
            memories = await self.memory.search_memories(db, user_id, "факты о пользователе, имя, предпочтения", limit=5)
            return "\n".join([m.content for m in memories]) if memories else "Нет сохранённых данных."
        except Exception as e:
            logger.error(f"Failed to build context: {e}")
            return "Нет сохранённых данных."
