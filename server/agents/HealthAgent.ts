import { BaseAgent } from './BaseAgent';
import { AurionEvent, eventBus } from '../core/EventBus';
import { createLogger } from '../core/Logger';
import { dbService } from '../services/DatabaseService';

const logger = createLogger('HealthAgent');

export class HealthAgent extends BaseAgent {
  constructor() {
    super('health-agent', 'HEALTH');
  }

  async handleEvent(event: AurionEvent): Promise<void> {
    if (event.type === 'HEALTH_UPDATE') {
      logger.info(`Processing Health Update: ${event.payload.message}`);
      
      const { heartRate, stressLevel, sleepScore } = event.payload;

      // Simple anomaly detection
      if (heartRate > 100 && stressLevel > 70) {
        logger.warn('High Stress Detected! Initiating Health Alert.');
        eventBus.publish({
          id: `health-${Date.now()}`,
          type: 'HEALTH_ALERT',
          payload: { heartRate, stressLevel, source: 'HealthAgent', reason: 'High Stress' },
          priority: 'high',
          timestamp: Date.now(),
          source: 'HealthAgent'
        });
      }

      // Persist to DB (assuming health_metrics table exists or fallback to events)
      // Since health_metrics table was not in the initial schema I saw, I'll use events for now or check DB service again.
      // Actually, I should check if health_metrics table exists.
      // The previous view of DatabaseService.ts showed system_metrics but not health_metrics.
      // I will log to events table to be safe.
      
      try {
        dbService.getDb().prepare(`
          INSERT INTO events (id, type, payload, priority, source, timestamp)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(event.id, 'HEALTH_UPDATE', JSON.stringify(event.payload), 'low', 'HealthAgent', Date.now());
      } catch (e) {
        logger.error('Failed to log health event', e);
      }
    }
  }

  async execute(command: string, context: any): Promise<any> {
    this.status = 'active';
    logger.info(`Analyzing health data: ${command}`);
    // Mock analysis
    const result = { status: 'healthy', recommendation: 'Drink water' };
    await this.logAction('HEALTH_ANALYSIS', { command, result });
    this.status = 'idle';
    return result;
  }
}

export const healthAgent = new HealthAgent();
