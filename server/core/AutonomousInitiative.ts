import { eventBus, AurionEvent } from './EventBus';
import { createLogger } from './Logger';
import { riskEngine } from '../services/RiskEngine';
import { dbService } from '../services/DatabaseService';

const logger = createLogger('AutonomousInitiative');

interface InitiativeConfig {
  baseThreshold: number;
  cooldownMs: number;
  silentMode: boolean;
}

export class AutonomousInitiative {
  private config: InitiativeConfig;
  private lastInitiativeTime: number = 0;
  private recentEvents: AurionEvent[] = [];

  constructor() {
    this.config = {
      baseThreshold: 0.7, // 0-1
      cooldownMs: 5 * 60 * 1000, // 5 minutes
      silentMode: false
    };
    this.init();
  }

  private init() {
    eventBus.on('*', (event: AurionEvent) => {
      this.handleEvent(event);
    });
    logger.info('Autonomous Initiative Engine initialized.');
  }

  private async handleEvent(event: AurionEvent) {
    // Ignore own events to prevent loops
    if (event.source === 'AutonomousInitiative') return;

    this.recentEvents.push(event);
    if (this.recentEvents.length > 20) this.recentEvents.shift();

    await this.evaluateInitiative(event);
  }

  private async evaluateInitiative(triggerEvent: AurionEvent) {
    const now = Date.now();
    
    // 1. Check Cooldown (unless Crisis)
    const isCrisis = triggerEvent.priority === 'critical';
    if (!isCrisis && (now - this.lastInitiativeTime < this.config.cooldownMs)) {
      return;
    }

    // 2. Calculate Confidence Score
    const confidence = this.calculateConfidence(triggerEvent);
    
    // 3. Adjust Threshold based on Context
    let threshold = this.config.baseThreshold;
    
    // Lower threshold for high priority events
    if (triggerEvent.priority === 'high') threshold -= 0.2;
    if (triggerEvent.priority === 'critical') threshold -= 0.5;

    // Check Risk Level
    const currentRisk = riskEngine.calculateRisk({
      deviceWeight: 1, 
      timeModifier: 1, 
      scenarioModifier: 1, 
      anomalyFactor: 1, 
      historicalPatternBoost: 1
    });
    
    if (currentRisk > 50) threshold -= 0.2;

    logger.debug(`Evaluating Initiative: Confidence ${confidence.toFixed(2)} vs Threshold ${threshold.toFixed(2)}`);

    // 4. Decide
    if (confidence > threshold) {
      this.triggerInitiative(triggerEvent, confidence, "High confidence & risk factors met");
    }
  }

  private calculateConfidence(event: AurionEvent): number {
    let score = 0.5; // Base score

    // Boost for specific event types
    if (event.type === 'SECURITY_ALERT') score += 0.3;
    if (event.type === 'HEALTH_ALERT') score += 0.4;
    if (event.type === 'DEVICE_ACTION' && event.payload.status === 'error') score += 0.2;

    return Math.min(1.0, score);
  }

  private triggerInitiative(triggerEvent: AurionEvent, confidence: number, reason: string) {
    this.lastInitiativeTime = Date.now();
    
    logger.info(`Initiating Autonomous Dialogue. Reason: ${reason}`);

    const initiativeEvent: AurionEvent = {
      id: `auto-${Date.now()}`,
      type: 'AI_INITIATIVE',
      payload: {
        triggerEventId: triggerEvent.id,
        confidence,
        reason,
        context: triggerEvent.payload
      },
      priority: triggerEvent.priority === 'critical' ? 'critical' : 'medium',
      timestamp: Date.now(),
      source: 'AutonomousInitiative'
    };

    // Publish an event that the Orchestrator or Voice Module will pick up
    eventBus.publish(initiativeEvent);

    // Log to DB with correct schema
    try {
      dbService.getDb().prepare(`
        INSERT INTO events (id, type, payload, priority, source, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        initiativeEvent.id,
        initiativeEvent.type,
        JSON.stringify(initiativeEvent.payload),
        initiativeEvent.priority,
        initiativeEvent.source,
        initiativeEvent.timestamp
      );
    } catch (e) {
      logger.error('Failed to log initiative to DB', e);
    }
  }

  public setSilentMode(enabled: boolean) {
    this.config.silentMode = enabled;
  }
}

export const autonomousInitiative = new AutonomousInitiative();
