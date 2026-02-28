import { BaseAgent } from './BaseAgent';
import { AurionEvent } from '../core/EventBus';
import { createLogger } from '../core/Logger';
import { llmService } from '../services/LLMService';

const logger = createLogger('ResearchAgent');

export class ResearchAgent extends BaseAgent {
  constructor() {
    super('agent-research', 'RESEARCH');
  }

  async handleEvent(event: AurionEvent): Promise<void> {
    if (event.type === 'RESEARCH_REQUEST') {
      await this.execute(event.payload.command, event.payload.context);
    }
  }

  async execute(command: string, context: any): Promise<any> {
    this.status = 'active';
    logger.info(`Researching: ${command}`);

    try {
      const prompt = `Выполни глубокий исследовательский анализ по теме: "${command}". 
        Контекст: ${JSON.stringify(context)}.
        Предоставь краткое изложение, ключевые выводы и потенциальные последствия. 
        Формат JSON с полями 'summary' (краткое изложение на русском), 'findings' (массив выводов), и 'implications' (массив последствий).`;

      const response = await llmService.generate(prompt, 'reasoning', {
        jsonMode: true,
        temperature: 0.4
      });

      const research = JSON.parse(response);
      await this.logAction('RESEARCH_COMPLETED', research);
      
      this.status = 'idle';
      return research;
    } catch (e) {
      this.status = 'error';
      logger.error('Research failed', e);
      return { error: 'Research failed' };
    }
  }
}
