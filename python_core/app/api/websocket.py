from fastapi import WebSocket, WebSocketDisconnect, APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.conversation_manager import ConversationManager
from app.services.tts_advanced import TTSService
from app.services.memory_system import MemorySystem
from app.api.chat_routes import get_conversation_history, save_message
import json
import base64

router = APIRouter()
manager = ConversationManager()
tts = TTSService()
memory = MemorySystem()

@router.websocket("/ws/voice")
async def websocket_voice(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            command = json.loads(data)
            transcript = command.get("transcript", "")
            user_id = 1  # в реальности из аутентификации

            # Получаем историю
            history = await get_conversation_history(db, user_id, limit=20)

            reply = await manager.process_message(
                user_id=user_id,
                message=transcript,
                conversation_history=history,
                db=db
            )
            
            # Сохраняем сообщение пользователя и ответ
            await save_message(db, user_id, "user", transcript)
            await save_message(db, user_id, "assistant", reply)
            
            audio_bytes = await tts.synthesize(reply)
            audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')

            await websocket.send_json({
                "text": reply,
                "audio": audio_b64,
                "action": "chat",
                "success": True
            })
    except WebSocketDisconnect:
        print("Client disconnected")
