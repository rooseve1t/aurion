import { AurionEvent } from '../core/EventBus';
import { createLogger } from '../core/Logger';
import { dbService } from '../services/DatabaseService';

const logger = createLogger('BaseAgent');

export abstract class BaseAgent {
  protected id: string;
  protected type: string;
  protected status: 'idle' | 'active' | 'error' = 'idle';

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
    logger.info(`Agent ${id} initialized.`);
  }

  abstract handleEvent(event: AurionEvent): Promise<void>;
  
  // New abstract method for direct execution
  abstract execute(command: string, context: any): Promise<any>;

  protected async logAction(action: string, result: any) {
    logger.info(`[${this.id}] Action: ${action}`, result);
    
    try {
      dbService.getDb().prepare(`
        INSERT INTO agent_logs (agent_id, action, result, timestamp)
        VALUES (?, ?, ?, ?)
      `).run(this.id, action, JSON.stringify(result), Date.now());
    } catch (e) {
      logger.error(`Failed to persist log for agent ${this.id}`, e);
    }
  }

  public getStatus() {
    return this.status;
  }

  public getId() {
    return this.id;
  }
}
