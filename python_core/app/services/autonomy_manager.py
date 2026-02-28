from app.services.decision_engine import AutonomyLevel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

class AutonomyManager:
    async def get_user_autonomy_level(self, db: AsyncSession, user_id: int) -> AutonomyLevel:
        # В реальности читаем из профиля пользователя
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user and user.role == "admin":
            return AutonomyLevel.AUTONOMOUS
        return AutonomyLevel.NOTIFIED  # значение по умолчанию

    async def set_user_autonomy_level(self, db: AsyncSession, user_id: int, level: AutonomyLevel):
        # Обновляем в БД
        logger.info(f"Set autonomy level for user {user_id} to {level.name}")
        # Здесь должно быть обновление поля в таблице users
