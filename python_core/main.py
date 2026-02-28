import asyncio
import logging
import sys
import psutil
from api.server import start_server
from system_control.manager import SystemManager
from ai_engine.memory import MemoryGraph

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("AurionCore")

class AurionDaemon:
    def __init__(self):
        self.system = SystemManager()
        self.memory = MemoryGraph()
        self.running = True

    async def watchdog_loop(self):
        """Цикл самовосстановления и мониторинга системы"""
        logger.info("Watchdog инициализирован.")
        while self.running:
            try:
                # Проверка состояния системы
                cpu = psutil.cpu_percent()
                ram = psutil.virtual_memory().percent
                
                if cpu > 90 or ram > 90:
                    logger.warning(f"Высокое потребление ресурсов: CPU {cpu}%, RAM {ram}%")
                    # Запуск протокола самовосстановления или оповещения
                    
                await asyncio.sleep(5)
            except Exception as e:
                logger.error(f"Ошибка Watchdog: {e}")
                await asyncio.sleep(1)

    async def run(self):
        logger.info("Запуск AURION Hybrid Core...")
        
        # Запуск FastAPI сервера в фоновом режиме
        server_task = asyncio.create_task(start_server(self))
        
        # Запуск Watchdog
        watchdog_task = asyncio.create_task(self.watchdog_loop())
        
        await asyncio.gather(server_task, watchdog_task)

if __name__ == "__main__":
    daemon = AurionDaemon()
    try:
        asyncio.run(daemon.run())
    except KeyboardInterrupt:
        logger.info("Завершение работы AURION Core...")
        sys.exit(0)
