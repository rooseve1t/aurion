import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from app.main import app
from app.api.auth import get_current_user
from app.models.user import User

client = TestClient(app)

async def override_get_current_user():
    user = User(id=1, email="test@example.com")
    return user

app.dependency_overrides[get_current_user] = override_get_current_user

@pytest.fixture
def mock_db():
    return AsyncMock()

@patch("app.api.routes.get_db")
@patch("app.api.routes.CommandExecutor")
@patch("app.api.routes.MemorySystem")
@patch("app.api.routes.TTSService")
def test_voice_command_route(mock_tts, mock_memory, mock_executor, mock_get_db):
    # Setup mocks
    mock_db_session = AsyncMock()
    mock_get_db.return_value = mock_db_session
    
    executor_instance = AsyncMock()
    executor_instance.execute_command.return_value = {
        "action": "general_question",
        "result": "Это тестовый ответ",
        "success": True
    }
    mock_executor.return_value = executor_instance
    
    memory_instance = AsyncMock()
    memory_instance.get_conversation_history.return_value = []
    mock_memory.return_value = memory_instance
    
    tts_instance = AsyncMock()
    tts_instance.synthesize.return_value = b"audio_data"
    mock_tts.return_value = tts_instance

    # Make request
    response = client.post(
        "/api/voice/command",
        json={"transcript": "Привет, как дела?", "emotional_state": "calm"}
    )

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["action"] == "general_question"
    assert data["result"] == "Это тестовый ответ"
    assert data["success"] is True
    assert "audio_base64" in data
    assert "conversation_id" in data
    
    # Verify calls
    executor_instance.execute_command.assert_called_once()
    memory_instance.add_voice_command.assert_called_once()
    tts_instance.synthesize.assert_called_once_with("Это тестовый ответ")
