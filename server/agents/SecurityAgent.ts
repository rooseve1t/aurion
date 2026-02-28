import { BaseAgent } from './BaseAgent';
import { AurionEvent, eventBus } from '../core/EventBus';
import { createLogger } from '../core/Logger';
import { riskEngine } from '../services/RiskEngine';
import { dbService } from '../services/DatabaseService';

const logger = createLogger('SecurityAgent');

export class SecurityAgent extends BaseAgent {
  constructor() {
    super('security-agent', 'SECURITY');
  }

  async handleEvent(event: AurionEvent): Promise<void> {
    if (event.type === 'SECURITY_ALERT') {
      logger.info(`Processing Security Alert: ${event.payload.message}`);
      
      const risk = riskEngine.calculateRisk({
        deviceWeight: event.payload.deviceWeight || 1.0,
        timeModifier: event.payload.timeModifier || 1.0,
        scenarioModifier: event.payload.scenarioModifier || 1.0,
        anomalyFactor: event.payload.anomalyFactor || 1.0,
        historicalPatternBoost: event.payload.historicalPatternBoost || 1.0
      });

      logger.info(`Risk Score: ${risk}`);

      if (risk > 80) {
        logger.warn('High Risk Detected! Initiating Emergency Protocol.');
        eventBus.publish({
          id: `sec-${Date.now()}`,
          type: 'EMERGENCY_PROTOCOL',
          payload: { risk, source: 'SecurityAgent', reason: 'High Risk Alert' },
          priority: 'critical',
          timestamp: Date.now(),
          source: 'SecurityAgent'
        });
      }

      // Persist to DB
      try {
        dbService.getDb().prepare(`
          INSERT INTO events (id, type, payload, priority, source, timestamp)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(event.id, 'SECURITY', JSON.stringify(event.payload), 'high', 'SecurityAgent', Date.now());
      } catch (e) {
        logger.error('Failed to log security event', e);
      }
    }
  }

  async execute(command: string, context: any): Promise<any> {
    this.status = 'active';
    logger.info(`Executing security check: ${command}`);
    // Mock security check
    const result = { status: 'secure', issues: [] };
    await this.logAction('SECURITY_CHECK', { command, result });
    this.status = 'idle';
    return result;
  }
}

export const securityAgent = new SecurityAgent();
