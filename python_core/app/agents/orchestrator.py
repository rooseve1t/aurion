import re
from app.agents.search_agent import SearchAgent
from app.agents.calendar_agent import CalendarAgent
import logging

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    def __init__(self):
        self.search_agent = SearchAgent()
        self.calendar_agent = CalendarAgent()

    async def process_task(self, task_description: str) -> str:
        task_lower = task_description.lower()
        if "найди в интернете" in task_lower or "поищи" in task_lower:
            query = re.sub(r"(найди в интернете|поищи)", "", task_description).strip()
            return await self.search_agent.search(query)
        elif "добавь встречу" in task_lower or "создай событие" in task_lower:
            return await self.calendar_agent.create_event(task_description)
        else:
            return "Не могу обработать задачу. Попробуйте уточнить."
