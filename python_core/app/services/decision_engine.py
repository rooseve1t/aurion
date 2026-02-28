from enum import Enum
from typing import Dict, Any, Optional
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

class AutonomyLevel(Enum):
    PASSIVE = 0
    ADVISORY = 1
    NOTIFIED = 2
    AUTONOMOUS = 3
    CRITICAL = 4

class Decision(BaseModel):
    action: str
    reasoning: str
    risk_score: int
    confidence: float
    autonomy_level: AutonomyLevel
    requires_approval: bool

class DecisionEngine:
    def __init__(self):
        self.risk_thresholds = {
            AutonomyLevel.PASSIVE: 0,
            AutonomyLevel.ADVISORY: 30,
            AutonomyLevel.NOTIFIED: 50,
            AutonomyLevel.AUTONOMOUS: 70,
            AutonomyLevel.CRITICAL: 90,
        }
        # Для обучения: храним статистику решений в БД (через внешний сервис)

    async def make_decision(self, user_id: int, event_type: str, data: Dict[str, Any],
                            user_autonomy_level: AutonomyLevel) -> Decision:
        risk = self._calculate_risk(event_type, data)
        confidence = self._calculate_confidence(event_type, data, user_id)
        requires = risk > self.risk_thresholds[user_autonomy_level]
        action = self._select_action(event_type, data)
        reasoning = f"Риск {risk}%, уверенность {confidence:.0%}. "
        reasoning += "Требуется подтверждение." if requires else "Действую автономно."
        # Логируем решение (в реальности сохраняем в БД)
        logger.info(f"Decision for user {user_id}: {action}, risk={risk}, requires={requires}")
        return Decision(
            action=action,
            reasoning=reasoning,
            risk_score=risk,
            confidence=confidence,
            autonomy_level=user_autonomy_level,
            requires_approval=requires
        )

    def _calculate_risk(self, event_type: str, data: Dict) -> int:
        # Реальная логика оценки риска
        if event_type == "control_lock" and data.get("action") == "unlock":
            return 80
        if event_type == "delete_file":
            return 95
        if event_type == "set_temperature" and abs(data.get("temp", 20) - 20) > 5:
            return 40
        return 10

    def _calculate_confidence(self, event_type: str, data: Dict, user_id: int) -> float:
        # Здесь можно учитывать историю пользователя
        return 0.9

    def _select_action(self, event_type: str, data: Dict) -> str:
        return f"{event_type}_{data.get('action', 'unknown')}"
