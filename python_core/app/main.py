from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes, websocket, chat_routes
from app.api.auth import router as auth_router
from app.core.logger import logger
from app.core.database import engine, Base

app = FastAPI(title="Aurion OS API", version="2.4.1")

@app.on_event("startup")
async def startup():
    logger.info("Initializing database...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://aurionos-eqfemnyy.manus.space"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)
app.include_router(websocket.router)
app.include_router(chat_routes.router)
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Aurion OS Python backend is running"}
