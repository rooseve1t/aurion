import { BaseAgent } from './BaseAgent';
import { AurionEvent, eventBus } from '../core/EventBus';
import { createLogger } from '../core/Logger';
import { dbService } from '../services/DatabaseService';

const logger = createLogger('StrategicAgent');

export class StrategicAgent extends BaseAgent {
  constructor() {
    super('strategic-agent', 'STRATEGY');
  }

  async handleEvent(event: AurionEvent): Promise<void> {
    // Analyze patterns
    if (event.type === 'DEVICE_ACTION' || event.type === 'SECURITY_ALERT') {
      await this.analyzePattern(event);
    }
  }

  async execute(command: string, context: any): Promise<any> {
    this.status = 'active';
    logger.info(`Executing strategic analysis: ${command}`);
    
    // Mock strategic execution
    const result = { 
      strategy: 'Analysis complete', 
      recommendation: 'No immediate action required',
      confidence: 0.9 
    };
    
    await this.logAction('STRATEGY_EXECUTED', { command, result });
    this.status = 'idle';
    return result;
  }

  private async analyzePattern(event: AurionEvent) {
    // Mock pattern analysis
    // In a real system, this would query the DB for historical data and run statistical analysis
    
    if (event.type === 'SECURITY_ALERT' && event.payload.reason === 'Door Open') {
      // Check if this happens often at night
      const hour = new Date(event.timestamp).getHours();
      if (hour >= 22 || hour <= 5) {
        logger.info('Pattern Detected: Nightly Door Open Alert');
        
        eventBus.publish({
          id: `strat-${Date.now()}`,
          type: 'STRATEGIC_INSIGHT',
          payload: {
            insight: 'Пользователь часто забывает закрыть дверь на ночь.',
            recommendation: 'Предложить автоматическую блокировку дверей в 23:00.',
            confidence: 0.85
          },
          priority: 'medium',
          timestamp: Date.now(),
          source: 'StrategicAgent'
        });
      }
    }
  }
}

export const strategicAgent = new StrategicAgent();
