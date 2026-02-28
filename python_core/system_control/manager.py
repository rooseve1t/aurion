import psutil
import subprocess
import logging
import os
import sys

logger = logging.getLogger("SystemManager")

class SystemManager:
    def __init__(self):
        logger.info("Модуль управления системой инициализирован.")

    def get_running_processes(self):
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'username']):
            try:
                processes.append(proc.info)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        return processes

    def kill_process(self, pid: int):
        try:
            p = psutil.Process(pid)
            p.terminate()
            logger.info(f"Процесс {pid} завершен")
            return True
        except Exception as e:
            logger.error(f"Не удалось завершить процесс {pid}: {e}")
            return False

    def launch_application(self, app_path: str):
        try:
            # Cross-platform launch
            if os.name == 'nt':
                os.startfile(app_path)
            else:
                subprocess.Popen(['open' if sys.platform == 'darwin' else 'xdg-open', app_path])
            logger.info(f"Приложение запущено: {app_path}")
            return True
        except Exception as e:
            logger.error(f"Не удалось запустить приложение {app_path}: {e}")
            return False

    def get_system_metrics(self):
        return {
            "cpu": psutil.cpu_percent(interval=1),
            "ram": psutil.virtual_memory().percent,
            "disk": psutil.disk_usage('/').percent,
            "boot_time": psutil.boot_time()
        }
