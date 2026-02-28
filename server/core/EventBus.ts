import { EventEmitter } from 'events';
import { createLogger } from '../core/Logger';

const logger = createLogger('EventBus');

export interface AurionEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  publish(event: AurionEvent) {
    logger.debug(`Publishing event: ${event.type} [${event.priority}] from ${event.source}`);
    this.emit(event.type, event);
    this.emit('*', event); // Wildcard listener
  }

  subscribe(type: string, handler: (event: AurionEvent) => void) {
    this.on(type, handler);
    logger.debug(`Subscribed to ${type}`);
  }

  unsubscribe(type: string, handler: (event: AurionEvent) => void) {
    this.off(type, handler);
  }
}

export const eventBus = new EventBus();
