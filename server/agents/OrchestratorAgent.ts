import { BaseAgent } from './BaseAgent';
import { AurionEvent, eventBus } from '../core/EventBus';
import { createLogger } from '../core/Logger';
import { llmService } from '../services/LLMService';

const logger = createLogger('OrchestratorAgent');

export class OrchestratorAgent extends BaseAgent {
  constructor() {
    super('agent-orchestrator', 'ORCHESTRATION');
  }

  async handleEvent(event: AurionEvent): Promise<void> {
    if (event.type === 'TASK_REQUEST') {
      await this.execute(event.payload.command, event.payload.context);
    }
  }

  async execute(command: string, context: any): Promise<any> {
    this.status = 'active';
    logger.info(`Orchestrating task: ${command}`);

    try {
      // 1. Analyze the request to determine the best agent or if a plan is needed
      const prompt = `Ты — Оркестратор передовой ИИ-системы (подобной J.A.R.V.I.S.).
      Проанализируй следующий запрос пользователя: "${command}".
      Контекст: ${JSON.stringify(context)}.
      
      Доступные агенты:
      - planner: Создает детальные планы для сложных задач.
      - research: Выполняет глубокий анализ и сбор информации.
      - execution: Управляет устройствами и выполняет физические/цифровые действия.
      - email: Работает с электронной почтой.
      - calendar: Управляет расписанием и событиями.
      
      Определи наилучший план действий.
      Если задача сложная, выбери 'planner'.
      Если требуется информация или знания, выбери 'research'.
      Если это конкретное действие, выбери соответствующего агента.
      
      Верни JSON: { "targetAgent": "имя-агента", "refinedCommand": "конкретная инструкция для агента на русском языке", "reasoning": "почему" }`;

      const response = await llmService.generate(prompt, 'reasoning', {
        jsonMode: true,
        temperature: 0.1
      });

      const decision = JSON.parse(response);
      await this.logAction('DECISION_MADE', decision);

      logger.info(`Delegating to ${decision.targetAgent}: ${decision.refinedCommand}`);

      // Dispatch event to the target agent
      // In a real system, we might wait for the result. For now, we fire and forget or use a callback mechanism if implemented.
      // But since execute returns a Promise, we should ideally wait.
      
      // We can use the EventBus to trigger the agent, but to get the result back synchronously here is tricky with just EventBus.
      // For this implementation, we'll assume the Orchestrator can directly invoke agents if they are registered, 
      // or we just emit the event and the system handles it.
      
      // Let's emit an event that the specific agent listens to.
      let eventType = 'UNKNOWN';
      switch (decision.targetAgent) {
        case 'planner': eventType = 'PLAN_REQUEST'; break;
        case 'research': eventType = 'RESEARCH_REQUEST'; break;
        case 'execution': eventType = 'EXECUTION_REQUEST'; break;
        // Add others as needed
        default: eventType = 'GENERAL_REQUEST';
      }

      eventBus.publish({
        id: `orch-${Date.now()}`,
        type: eventType,
        payload: {
          command: decision.refinedCommand,
          context: { ...context, originalRequest: command }
        },
        priority: 'medium',
        source: 'agent-orchestrator',
        timestamp: Date.now()
      });

      this.status = 'idle';
      return decision;

    } catch (e) {
      this.status = 'error';
      logger.error('Orchestration failed', e);
      return { error: 'Orchestration failed' };
    }
  }
}
