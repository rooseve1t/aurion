import sys
from loguru import logger
logger.remove()
logger.add(sys.stdout, format="{time} | {level} | {message}", level="INFO")
logger.add("logs/aurion.log", rotation="10 MB", level="DEBUG")
