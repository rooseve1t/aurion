from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.memory import MemoryEntry
from app.models.voice_command import VoiceCommand
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

class MemorySystem:
    async def add_memory(self, db: AsyncSession, user_id: int, content: str):
        try:
            embedding = model.encode(content).tolist()
            entry = MemoryEntry(user_id=user_id, content=content, embedding=embedding)
            db.add(entry)
            await db.commit()
        except Exception as e:
            logger.error(f"Failed to add memory: {e}")
            await db.rollback()

    async def search_memories(self, db: AsyncSession, user_id: int, query: str, limit: int = 5):
        try:
            query_emb = model.encode(query).tolist()
            stmt = select(MemoryEntry).where(MemoryEntry.user_id == user_id).order_by(
                MemoryEntry.embedding.l2_distance(query_emb)
            ).limit(limit)
            result = await db.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Memory search failed: {e}")
            return []

    async def get_conversation_history(self, db: AsyncSession, user_id: int, limit: int = 10) -> List[Dict]:
        try:
            stmt = select(VoiceCommand).where(VoiceCommand.user_id == user_id).order_by(VoiceCommand.created_at.desc()).limit(limit)
            result = await db.execute(stmt)
            commands = result.scalars().all()
            history = []
            for cmd in reversed(commands):
                history.append({"role": "user", "content": cmd.transcript})
                if cmd.response:
                    history.append({"role": "assistant", "content": cmd.response})
            return history
        except Exception as e:
            logger.error(f"Failed to get conversation history: {e}")
            return []

    async def add_voice_command(self, db: AsyncSession, user_id: int, transcript: str, response: str, command_type: str = "unknown", confidence: int = 100, status: str = "success"):
        try:
            cmd = VoiceCommand(
                user_id=user_id,
                command=command_type,
                transcript=transcript,
                response=response,
                confidence=confidence,
                status=status
            )
            db.add(cmd)
            await db.commit()
        except Exception as e:
            logger.error(f"Failed to add voice command: {e}")
            await db.rollback()

    async def save_fact(self, db: AsyncSession, user_id: int, key: str, value: str):
        content = f"Факт о пользователе - {key}: {value}"
        await self.add_memory(db, user_id, content)

    async def get_user_facts(self, db: AsyncSession, user_id: int, limit: int = 10) -> List[str]:
        # Поиск по ключевому слову "Факт о пользователе"
        try:
            stmt = select(MemoryEntry).where(
                MemoryEntry.user_id == user_id,
                MemoryEntry.content.like("Факт о пользователе%")
            ).limit(limit)
            result = await db.execute(stmt)
            entries = result.scalars().all()
            return [e.content for e in entries]
        except Exception as e:
            logger.error(f"Failed to get user facts: {e}")
            return []
