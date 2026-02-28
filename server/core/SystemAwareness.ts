import { createLogger } from './Logger';
import { eventBus, AurionEvent } from './EventBus';
import { dbService } from '../services/DatabaseService';

const logger = createLogger('SystemAwareness');

export class SystemAwareness {
  private agentStatus: Map<string, 'active' | 'idle' | 'error'> = new Map();
  private lastHeartbeat: number = Date.now();

  constructor() {
    this.init();
  }

  private init() {
    eventBus.on('*', (event: AurionEvent) => {
      this.updateAgentStatus(event.source);
    });

    setInterval(() => this.checkHealth(), 60000); // Check every minute
    logger.info('System Awareness Layer initialized.');
  }

  private updateAgentStatus(agentId: string) {
    this.agentStatus.set(agentId, 'active');
    this.lastHeartbeat = Date.now();
  }

  private checkHealth() {
    const now = Date.now();
    for (const [agentId, status] of this.agentStatus.entries()) {
      if (status === 'active' && now - this.lastHeartbeat > 300000) { // 5 minutes inactivity
        logger.warn(`Agent ${agentId} appears idle/unresponsive.`);
        this.agentStatus.set(agentId, 'idle');
        
        eventBus.publish({
          id: `sys-${Date.now()}`,
          type: 'SYSTEM_WARNING',
          payload: { agentId, issue: 'Inactivity' },
          priority: 'medium',
          timestamp: Date.now(),
          source: 'SystemAwareness'
        });
      }
    }

    // Check DB Connection
    try {
      dbService.getDb().prepare('SELECT 1').get();
    } catch (e) {
      logger.error('Database Connection Failed!');
      eventBus.publish({
        id: `sys-${Date.now()}`,
        type: 'SYSTEM_CRITICAL',
        payload: { component: 'Database', issue: 'Connection Lost' },
        priority: 'critical',
        timestamp: Date.now(),
        source: 'SystemAwareness'
      });
    }
  }

  public getSystemHealth() {
    return {
      agents: Object.fromEntries(this.agentStatus),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
  }
}

export const systemAwareness = new SystemAwareness();
