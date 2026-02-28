from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.conversation_manager import ConversationManager
from app.api.auth import get_current_user
from app.models.user import User
from app.models.conversation import ConversationMessage
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
import uuid

router = APIRouter(tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    conversation_id: str

async def get_conversation_history(db: AsyncSession, user_id: int, limit: int = 20) -> List[dict]:
    stmt = select(ConversationMessage).where(
        ConversationMessage.user_id == user_id
    ).order_by(ConversationMessage.created_at.desc()).limit(limit)
    result = await db.execute(stmt)
    messages = result.scalars().all()
    # Возвращаем в правильном порядке (от старых к новым)
    return [{"role": m.role, "content": m.content} for m in reversed(messages)]

async def save_message(db: AsyncSession, user_id: int, role: str, content: str):
    msg = ConversationMessage(user_id=user_id, role=role, content=content)
    db.add(msg)
    await db.commit()

@router.post("/api/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    history = await get_conversation_history(db, current_user.id, limit=20)
    manager = ConversationManager()
    reply = await manager.process_message(
        user_id=current_user.id,
        message=request.message,
        conversation_history=history,
        db=db
    )
    # Сохраняем сообщение пользователя и ответ
    await save_message(db, current_user.id, "user", request.message)
    await save_message(db, current_user.id, "assistant", reply)
    
    conversation_id = request.conversation_id or str(uuid.uuid4())
    return ChatResponse(reply=reply, conversation_id=conversation_id)
