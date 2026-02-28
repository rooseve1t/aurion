import { eventBus, AurionEvent } from './EventBus';
import { PriorityQueue, Task } from './PriorityQueue';
import { BaseAgent } from '../agents/BaseAgent';
import { createLogger } from './Logger';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('Orchestrator');

export class Orchestrator {
  private queue: PriorityQueue;
  private agents: Map<string, BaseAgent>;
  private isRunning: boolean = false;

  constructor() {
    this.queue = new PriorityQueue();
    this.agents = new Map();
    this.init();
  }

  private init() {
    eventBus.on('*', (event: AurionEvent) => {
      this.handleEvent(event);
    });
    logger.info('Orchestrator initialized.');
  }

  public registerAgent(agent: BaseAgent) {
    this.agents.set(agent.getId(), agent);
    logger.info(`Agent registered: ${agent.getId()}`);
  }

  public start() {
    this.isRunning = true;
    this.processQueue();
    logger.info('Orchestrator started.');
  }

  public stop() {
    this.isRunning = false;
    logger.info('Orchestrator stopped.');
  }

  private handleEvent(event: AurionEvent) {
    const priorityMap = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4
    };
    
    const task: Task = {
      id: uuidv4(),
      event,
      priority: priorityMap[event.priority] || 1,
      timestamp: Date.now()
    };

    this.queue.enqueue(task);
    logger.debug(`Task enqueued: ${event.type} [Priority: ${task.priority}]`);
  }

  private async processQueue() {
    if (!this.isRunning) return;

    while (!this.queue.isEmpty()) {
      const task = this.queue.dequeue();
      if (!task) break;

      logger.info(`Processing task: ${task.event.type} [ID: ${task.id}]`);
      
      try {
        // Dispatch to relevant agents based on event type
        // For now, broadcast to all agents capable of handling it
        // In a real system, we'd have a routing table
        
        const promises = Array.from(this.agents.values()).map(agent => agent.handleEvent(task.event));
        await Promise.all(promises);
        
        logger.info(`Task completed: ${task.id}`);
      } catch (error) {
        logger.error(`Task failed: ${task.id}`, error);
        // Implement retry logic here if needed
      }
    }

    // Schedule next check
    setTimeout(() => this.processQueue(), 100);
  }
}

export const orchestrator = new Orchestrator();
