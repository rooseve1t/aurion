import platform
import subprocess
import psutil
import asyncio
import logging

logger = logging.getLogger(__name__)

class DesktopControl:
    def __init__(self):
        self.os = platform.system()

    async def open_app(self, app_name: str) -> str:
        app_name = app_name.lower()
        try:
            if self.os == "Windows":
                if "блокнот" in app_name:
                    subprocess.Popen("notepad.exe")
                elif "калькулятор" in app_name:
                    subprocess.Popen("calc.exe")
                elif "браузер" in app_name:
                    subprocess.Popen("start chrome", shell=True)
                else:
                    return f"Не знаю, как открыть {app_name} на Windows."
            elif self.os == "Linux":
                if "блокнот" in app_name or "текстовый редактор" in app_name:
                    subprocess.Popen(["gedit"])
                elif "калькулятор" in app_name:
                    subprocess.Popen(["gnome-calculator"])
                elif "браузер" in app_name:
                    subprocess.Popen(["firefox"])
                else:
                    return f"Не знаю, как открыть {app_name} на Linux."
            elif self.os == "Darwin":  # macOS
                if "блокнот" in app_name or "текстовый редактор" in app_name:
                    subprocess.Popen(["open", "-a", "TextEdit"])
                elif "калькулятор" in app_name:
                    subprocess.Popen(["open", "-a", "Calculator"])
                elif "браузер" in app_name:
                    subprocess.Popen(["open", "-a", "Safari"])
                else:
                    return f"Не знаю, как открыть {app_name} на macOS."
            return f"Открываю {app_name}."
        except Exception as e:
            logger.error(f"Failed to open {app_name}: {e}")
            return f"Ошибка при открытии {app_name}."

    async def get_cpu_usage(self) -> str:
        cpu = psutil.cpu_percent(interval=1)
        return f"Загрузка CPU: {cpu}%"

    async def get_memory_usage(self) -> str:
        mem = psutil.virtual_memory()
        return f"Использование RAM: {mem.percent}%"
