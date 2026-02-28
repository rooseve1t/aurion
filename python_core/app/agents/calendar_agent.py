from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
import os.path
import pickle
from datetime import datetime, timedelta
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

SCOPES = ['https://www.googleapis.com/auth/calendar']

class CalendarAgent:
    def __init__(self):
        self.service = None
        self.creds = None
        if settings.GOOGLE_CREDENTIALS_FILE:
            self._authenticate()

    def _authenticate(self):
        """Аутентификация и получение сервиса Google Calendar."""
        creds = None
        token_file = 'token.pickle'
        if os.path.exists(token_file):
            with open(token_file, 'rb') as token:
                creds = pickle.load(token)
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    settings.GOOGLE_CREDENTIALS_FILE, SCOPES)
                creds = flow.run_local_server(port=0)
            with open(token_file, 'wb') as token:
                pickle.dump(creds, token)
        self.service = build('calendar', 'v3', credentials=creds)

    async def create_event(self, description: str) -> str:
        if not self.service:
            return "Календарь не настроен. Добавьте GOOGLE_CREDENTIALS_FILE в .env"
        try:
            # Парсим описание (упрощённо)
            # В реальности нужно использовать NLP для извлечения даты, времени, названия
            # Здесь просто создаём событие на завтра
            event = {
                'summary': description,
                'start': {
                    'dateTime': (datetime.now() + timedelta(days=1)).isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': (datetime.now() + timedelta(days=1, hours=1)).isoformat(),
                    'timeZone': 'UTC',
                },
            }
            created_event = self.service.events().insert(calendarId='primary', body=event).execute()
            return f"Событие создано: {created_event.get('htmlLink')}"
        except Exception as e:
            logger.error(f"Calendar error: {e}")
            return f"Ошибка при создании события: {e}"
