import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.voice_executor import CommandExecutor

@pytest.mark.asyncio
async def test_classify_intent_heuristics():
    executor = CommandExecutor()
    
    # Test heuristics
    assert await executor._classify_intent("Включи свет в гостиной") == "control_light"
    assert await executor._classify_intent("Открой блокнот") == "open_app"
    assert await executor._classify_intent("Какая загрузка процессора?") == "system_info"
    assert await executor._classify_intent("Найди в интернете рецепт пиццы") == "web_search"
    assert await executor._classify_intent("Какой у меня пульс?") == "health_check"

@pytest.mark.asyncio
async def test_classify_intent_llm_fallback(mocker):
    executor = CommandExecutor()
    
    # Mock LLM router
    mock_llm = AsyncMock()
    mock_llm.classify_intent.return_value = "general_question"
    executor.llm = mock_llm
    
    # Test fallback
    assert await executor._classify_intent("Расскажи шутку") == "general_question"
    mock_llm.classify_intent.assert_called_once_with("Расскажи шутку")
