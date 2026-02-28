from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.voice_executor import CommandExecutor
from app.services.tts_advanced import TTSService
from app.services.memory_system import MemorySystem
from app.api.auth import get_current_user, authenticate_user, create_access_token, get_password_hash
from app.models.user import User
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
import base64
import uuid

router = APIRouter(prefix="/api", tags=["aurion"])

class VoiceCommandRequest(BaseModel):
    transcript: str
    emotional_state: Optional[str] = "calm"
    conversation_id: Optional[str] = None

class VoiceCommandResponse(BaseModel):
    command_id: str
    original_command: str
    action: str
    result: str
    success: bool
    audio_base64: Optional[str] = None
    conversation_id: str

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed, name=user_data.name)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    access_token = create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/voice/command", response_model=VoiceCommandResponse)
async def execute_voice_command(
    request: VoiceCommandRequest,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    executor = CommandExecutor()
    memory = MemorySystem()
    
    conversation_id = request.conversation_id or str(uuid.uuid4())
    
    # Получаем историю
    history = await memory.get_conversation_history(db, current_user.id)
    
    result = await executor.execute_command(
        db, 
        current_user.id, 
        request.transcript, 
        request.emotional_state,
        conversation_history=history
    )

    # Сохраняем команду и ответ
    await memory.add_voice_command(
        db,
        user_id=current_user.id,
        transcript=request.transcript,
        response=result["result"],
        command_type=result["action"],
        success=result["success"]
    )

    tts = TTSService()
    audio_bytes = await tts.synthesize(result["result"])
    audio_b64 = base64.b64encode(audio_bytes).decode('utf-8') if audio_bytes else None

    return VoiceCommandResponse(
        command_id=str(uuid.uuid4()),
        original_command=request.transcript,
        action=result["action"],
        result=result["result"],
        success=result["success"],
        audio_base64=audio_b64,
        conversation_id=conversation_id
    )

@router.get("/health")
async def health_check():
    return {"status": "ok"}

class InsightRequest(BaseModel):
    state: dict

@router.post("/insight")
async def get_insight(request: InsightRequest):
    # В будущем здесь будет логика проактивности
    return {"insight": None, "priority": "LOW"}
