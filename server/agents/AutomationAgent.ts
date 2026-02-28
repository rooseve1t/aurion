import { BaseAgent } from './BaseAgent';
import { AurionEvent, eventBus } from '../core/EventBus';
import { createLogger } from '../core/Logger';
import { dbService } from '../services/DatabaseService';
import { smartHomeManager } from '../services/SmartHomeManager';

const logger = createLogger('AutomationAgent');

export class AutomationAgent extends BaseAgent {
  constructor() {
    super('automation-agent', 'AUTOMATION');
  }

  async handleEvent(event: AurionEvent): Promise<void> {
    if (event.type === 'SENSOR_UPDATE') {
      logger.info(`Processing Sensor Update: ${event.payload.device} -> ${event.payload.value}`);
      
      const { device, value } = event.payload;

      // Simple Rule Engine
      if (device === 'motion_sensor' && value === 'active') {
        logger.info('Motion Detected! Turning on lights.');
        
        // Use SmartHomeManager directly or via event
        await smartHomeManager.executeCommand('living_room_light', 'turn_on');

        eventBus.publish({
          id: `auto-${Date.now()}`,
          type: 'DEVICE_ACTION',
          payload: { device: 'living_room_light', action: 'turn_on' },
          priority: 'medium',
          timestamp: Date.now(),
          source: 'AutomationAgent'
        });
      }

      // Persist to DB
      try {
        dbService.getDb().prepare(`
          INSERT INTO events (id, type, payload, priority, source, timestamp)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(event.id, 'AUTOMATION', JSON.stringify(event.payload), 'low', 'AutomationAgent', Date.now());
      } catch (e) {
        logger.error('Failed to log automation event', e);
      }
    }
  }

  async execute(command: string, context: any): Promise<any> {
    this.status = 'active';
    logger.info(`Executing automation rule: ${command}`);
    // Mock execution
    const result = { status: 'success', message: 'Automation rule executed' };
    await this.logAction('AUTOMATION_EXECUTED', { command, result });
    this.status = 'idle';
    return result;
  }
}

export const automationAgent = new AutomationAgent();
