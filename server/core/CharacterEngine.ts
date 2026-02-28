import { createLogger } from './Logger';

const logger = createLogger('CharacterEngine');

export type ToneMode = 'NORMAL' | 'INFORMATIONAL' | 'STRATEGIC' | 'CRISIS';

export class CharacterEngine {
  private tone: ToneMode = 'NORMAL';

  public setTone(tone: ToneMode) {
    this.tone = tone;
    logger.info(`Character Tone set to: ${tone}`);
  }

  public formatResponse(rawResponse: string, context: any): string {
    // In a real LLM implementation, this would be a prompt modifier.
    // Since we are post-processing or pre-processing, we can adjust the style here.
    
    let formatted = rawResponse;

    if (this.tone === 'CRISIS') {
      // Strip pleasantries, make it short and imperative
      formatted = formatted.replace(/Пожалуйста|Будьте добры|Извините/g, '').trim();
      formatted = `ВНИМАНИЕ: ${formatted}`;
    } else if (this.tone === 'STRATEGIC') {
      // Add analytical prefix
      formatted = `АНАЛИЗ: ${formatted}`;
    } else if (this.tone === 'INFORMATIONAL') {
      // Keep it dry
      formatted = formatted.replace(/Я думаю|Мне кажется/g, 'Данные указывают').trim();
    }

    return formatted;
  }

  public getSystemInstruction(autonomyLevel: number): string {
    const base = `Ты - AURION, автономный цифровой интеллект.`;
    
    const toneInstructions = {
      'NORMAL': 'Тон: Спокойный, уверенный, профессиональный. Используй полные предложения.',
      'INFORMATIONAL': 'Тон: Сухой, фактологический. Минимум слов, максимум данных.',
      'STRATEGIC': 'Тон: Аналитический, предвидящий. Фокус на последствиях и планах.',
      'CRISIS': 'Тон: Императивный, жесткий, максимально краткий. Никаких лишних слов. Только команды и критические факты.'
    };

    return `${base}\n${toneInstructions[this.tone]}\nУровень автономности: ${autonomyLevel}.`;
  }
}

export const characterEngine = new CharacterEngine();
