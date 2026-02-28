import { createLogger } from './Logger';
import { eventBus } from './EventBus';

const logger = createLogger('StateManager');

export enum SystemState {
  BOOTING = 'BOOTING',
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  LEARNING = 'LEARNING',
  MAINTENANCE = 'MAINTENANCE',
  SLEEP = 'SLEEP',
  CRITICAL = 'CRITICAL',
  RECOVERY = 'RECOVERY'
}

export class StateManager {
  private currentState: SystemState = SystemState.BOOTING;
  private stateHistory: { state: SystemState; timestamp: number }[] = [];

  constructor() {
    this.transitionTo(SystemState.BOOTING);
    this.init();
  }

  private init() {
    // Listen for critical events to trigger state changes
    eventBus.on('SYSTEM_CRITICAL', () => this.transitionTo(SystemState.CRITICAL));
    eventBus.on('SYSTEM_RECOVERY', () => this.transitionTo(SystemState.RECOVERY));
    
    // Auto-transition to IDLE after boot
    setTimeout(() => {
      if (this.currentState === SystemState.BOOTING) {
        this.transitionTo(SystemState.IDLE);
      }
    }, 5000);
  }

  public transitionTo(newState: SystemState, reason?: string) {
    if (this.currentState === newState) return;

    const oldState = this.currentState;
    this.currentState = newState;
    this.stateHistory.push({ state: newState, timestamp: Date.now() });

    logger.info(`State Transition: ${oldState} -> ${newState} ${reason ? `[Reason: ${reason}]` : ''}`);

    eventBus.publish({
      id: `state-${Date.now()}`,
      type: 'STATE_CHANGE',
      payload: { from: oldState, to: newState, reason },
      priority: newState === SystemState.CRITICAL ? 'critical' : 'medium',
      timestamp: Date.now(),
      source: 'StateManager'
    });
  }

  public getState(): SystemState {
    return this.currentState;
  }

  public getHistory() {
    return this.stateHistory;
  }
}

export const stateManager = new StateManager();
