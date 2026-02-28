import httpx
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)

class SearchAgent:
    async def search(self, query: str) -> str:
        async with httpx.AsyncClient() as client:
            try:
                # Используем Bing для разнообразия (можно заменить на Google)
                url = f"https://www.bing.com/search?q={query}"
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
                resp = await client.get(url, headers=headers, timeout=10.0)
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, 'html.parser')
                # Парсим заголовки результатов
                results = soup.select("h2 a")
                if results:
                    # Берём первые 3 результата
                    top_results = [r.get_text(strip=True) for r in results[:3] if r.get_text()]
                    return "Вот что я нашёл:\n" + "\n".join(f"- {r}" for r in top_results)
                else:
                    return "Ничего не найдено."
            except Exception as e:
                logger.error(f"Search error: {e}")
                return f"Ошибка поиска: {e}"
