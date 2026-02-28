import asyncio
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn
from pydantic import BaseModel
from typing import List, Dict

logger = logging.getLogger("FastAPIServer")
app = FastAPI(title="AURION Hybrid Core API", version="1.0.0")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Клиент подключен. Активных: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"Клиент отключен. Активных: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Ошибка широковещательной рассылки: {e}")

manager = ConnectionManager()
daemon_instance = None

@app.get("/health")
async def health_check():
    return {"status": "online", "core": "Python Hybrid", "version": "1.0.0"}

@app.get("/system/metrics")
async def get_metrics():
    import psutil
    return {
        "cpu": psutil.cpu_percent(),
        "ram": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent
    }

class CommandRequest(BaseModel):
    command: str
    context: dict = {}

@app.post("/ai/execute")
async def execute_command(req: CommandRequest):
    # Route to AI Engine
    logger.info(f"Выполнение команды: {req.command}")
    # Mock execution for now, would call daemon_instance.ai_engine.process()
    return {"status": "success", "action": "Команда получена", "command": req.command}

@app.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Handle incoming WS messages
            logger.info(f"WS Получено: {data}")
            await manager.broadcast({"type": "ack", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def start_server(daemon):
    global daemon_instance
    daemon_instance = daemon
    config = uvicorn.Config(app, host="127.0.0.1", port=8000, log_level="info")
    server = uvicorn.Server(config)
    logger.info("Запуск FastAPI сервера на порту 8000...")
    await server.serve()
