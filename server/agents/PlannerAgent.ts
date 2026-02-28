import { BaseAgent } from './BaseAgent';
import { AurionEvent } from '../core/EventBus';
import { createLogger } from '../core/Logger';
import { llmService } from '../services/LLMService';

const logger = createLogger('PlannerAgent');

export class PlannerAgent extends BaseAgent {
  constructor() {
    super('agent-planner', 'PLANNING');
  }

  async handleEvent(event: AurionEvent): Promise<void> {
    if (event.type === 'PLAN_REQUEST') {
      await this.execute(event.payload.command, event.payload.context);
    }
  }

  async execute(command: string, context: any): Promise<any> {
    this.status = 'active';
    logger.info(`Planning task: ${command}`);

    try {
      const prompt = `Создай структурированный план для следующей задачи: "${command}". 
        Контекст: ${JSON.stringify(context)}.
        Верни JSON объект со списком шагов (steps), каждый из которых имеет 'description' (описание на русском) и 'estimatedTime' (ожидаемое время).`;

      const response = await llmService.generate(prompt, 'reasoning', {
        jsonMode: true,
        temperature: 0.2
      });

      const plan = JSON.parse(response);
      await this.logAction('PLAN_CREATED', plan);
      
      this.status = 'idle';
      return plan;
    } catch (e) {
      this.status = 'error';
      logger.error('Planning failed', e);
      return { error: 'Planning failed' };
    }
  }
}
