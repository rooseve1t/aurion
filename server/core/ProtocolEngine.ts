import { eventBus, AurionEvent } from './EventBus';
import { createLogger } from './Logger';
import { dbService } from '../services/DatabaseService';

const logger = createLogger('ProtocolEngine');

export type ProtocolType = 'SECURITY' | 'EMERGENCY' | 'STRATEGIC' | 'GUARDIAN' | 'NORMAL';

export class ProtocolEngine {
  private activeProtocol: ProtocolType = 'NORMAL';
  private protocolState: 'IDLE' | 'ACTIVE' | 'ESCALATED' = 'IDLE';

  constructor() {
    this.init();
  }

  private init() {
    eventBus.on('*', (event: AurionEvent) => {
      this.handleEvent(event);
    });
    logger.info('Protocol Engine initialized.');
  }

  private handleEvent(event: AurionEvent) {
    if (event.type === 'EMERGENCY_PROTOCOL') {
      this.activateProtocol('EMERGENCY');
    } else if (event.type === 'SECURITY_ALERT' && event.priority === 'critical') {
      this.activateProtocol('SECURITY');
    }
  }

  public activateProtocol(protocol: ProtocolType) {
    if (this.activeProtocol === protocol) return;

    logger.warn(`Activating Protocol: ${protocol}`);
    this.activeProtocol = protocol;
    this.protocolState = 'ACTIVE';

    // Publish Protocol Change Event
    eventBus.publish({
      id: `proto-${Date.now()}`,
      type: 'PROTOCOL_CHANGE',
      payload: { protocol, state: this.protocolState },
      priority: 'critical',
      timestamp: Date.now(),
      source: 'ProtocolEngine'
    });

    // Log to DB
    dbService.getDb().prepare(`
      INSERT INTO events (id, type, module, message, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).run(`proto-${Date.now()}`, 'PROTOCOL', 'ProtocolEngine', `Activated ${protocol}`, JSON.stringify({ protocol }));
  }

  public deactivateProtocol() {
    if (this.activeProtocol === 'NORMAL') return;

    logger.info(`Deactivating Protocol: ${this.activeProtocol}`);
    this.activeProtocol = 'NORMAL';
    this.protocolState = 'IDLE';

    eventBus.publish({
      id: `proto-${Date.now()}`,
      type: 'PROTOCOL_CHANGE',
      payload: { protocol: 'NORMAL', state: 'IDLE' },
      priority: 'medium',
      timestamp: Date.now(),
      source: 'ProtocolEngine'
    });
  }

  public getStatus() {
    return {
      activeProtocol: this.activeProtocol,
      state: this.protocolState
    };
  }
}

export const protocolEngine = new ProtocolEngine();
