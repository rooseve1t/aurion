import re
import time
from typing import Dict, Any, List, Optional
from app.services.llm_router import LLMRouter
from app.services.decision_engine import DecisionEngine, AutonomyLevel
from app.services.autonomy_manager import AutonomyManager
from app.services.smart_home import SmartHomeManager
from app.services.desktop_control import DesktopControl
from app.services.health_monitor import HealthMonitor
from app.services.memory_system import MemorySystem
from app.agents.orchestrator import AgentOrchestrator
from sqlalchemy.ext.asyncio import AsyncSession
import logging

logger = logging.getLogger(__name__)

class CommandExecutor:
    def __init__(self):
        self.llm = LLMRouter()
        self.decision_engine = DecisionEngine()
        self.autonomy_manager = AutonomyManager()
        self.smart_home = SmartHomeManager()
        self.desktop = DesktopControl()
        self.health = HealthMonitor()
        self.agent_orchestrator = AgentOrchestrator()
        self.memory = MemorySystem()

    async def _classify_intent(self, command: str) -> str:
        cmd_lower = command.lower()
        
        # Эвристика
        if "включи свет" in cmd_lower or "выключи свет" in cmd_lower:
            return "control_light"
        elif "открой" in cmd_lower and any(app in cmd_lower for app in ["блокнот", "калькулятор", "браузер"]):
            return "open_app"
        elif "cpu" in cmd_lower or "процессор" in cmd_lower:
            return "system_info"
        elif "найди в интернете" in cmd_lower or "поищи" in cmd_lower:
            return "web_search"
        elif "здоровье" in cmd_lower or "пульс" in cmd_lower or "шаги" in cmd_lower:
            return "health_check"
            
        # Fallback на LLM
        logger.info(f"Using LLM to classify intent for command: '{command}'")
        return await self.llm.classify_intent(command)

    async def execute_command(self, db: AsyncSession, user_id: int, command: str, emotional_state: str = "calm", conversation_history: Optional[List[Dict]] = None) -> Dict[str, Any]:
        start_time = time.time()
        logger.info(f"Executing command for user {user_id}: '{command}'")
        
        # 1. Проверяем уровень автономии пользователя
        autonomy_level = await self.autonomy_manager.get_user_autonomy_level(db, user_id)

        # 2. Классификация интента
        intent = await self._classify_intent(command)
        logger.info(f"Command classified as: {intent}")

        result_text = ""
        action = intent
        success = True
        decision_dict = None

        cmd_lower = command.lower()

        if intent == "control_light":
            light_action = "on" if "включи" in cmd_lower else "off"
            room = self._extract_room(command)
            device_id = f"light_{room}"
            decision = await self.decision_engine.make_decision(
                user_id, "control_light", {"action": light_action, "room": room}, autonomy_level
            )
            if decision.requires_approval:
                action = "request_approval"
                result_text = decision.reasoning
                decision_dict = decision.dict()
            else:
                result_text = await self.smart_home.control_light(device_id, light_action)

        elif intent == "open_app":
            app_name = "неизвестное приложение"
            match = re.search(r"открой (.*)", cmd_lower)
            if match:
                app_name = match.group(1)
            result_text = await self.desktop.open_app(app_name)

        elif intent == "system_info":
            result_text = await self.desktop.get_cpu_usage()

        elif intent == "web_search":
            result_text = await self.agent_orchestrator.process_task(command)

        elif intent == "health_check":
            metrics = await self.health.get_latest_metrics(user_id)
            result_text = f"Ваш пульс: {metrics.get('heart_rate')}, шаги: {metrics.get('steps')}, стресс: {metrics.get('stress_level')}."

        else:
            action = "general_question"
            system_prompt = self._get_system_prompt(emotional_state)
            
            # Подготовка истории для LLM
            prompt_with_history = ""
            if conversation_history:
                history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_history[-5:]])
                prompt_with_history = f"История диалога:\n{history_text}\n\nТекущий запрос: {command}"
            else:
                prompt_with_history = command
                
            result_text = await self.llm.ask_general(prompt_with_history, system_prompt)
            
            # Сохраняем важные факты в память
            if len(result_text) > 50: # Простая эвристика для сохранения
                await self.memory.add_memory(db, user_id, f"Запрос: {command}. Ответ: {result_text}")

        execution_time = time.time() - start_time
        logger.info(f"Command execution completed in {execution_time:.2f}s. Action: {action}, Result: {result_text[:50]}...")

        response = {
            "action": action, 
            "result": result_text, 
            "success": success
        }
        if decision_dict:
            response["decision"] = decision_dict
            
        return response

    def _extract_room(self, command: str) -> str:
        match = re.search(r"в ([\w]+)", command)
        return match.group(1) if match else "гостиная"

    def _get_system_prompt(self, emotional_state: str) -> str:
        base = "Ты — Джарвис, умный ассистент. Отвечай кратко, по делу, с лёгким остроумием."
        if emotional_state == "stressed":
            base += " Пользователь встревожен, говори спокойно и ободряюще."
        elif emotional_state == "excited":
            base += " Пользователь взволнован, поддержи его энтузиазм."
        return base
