import { createLogger } from './Logger';
import { eventBus } from './EventBus';
import { stateManager, SystemState } from './StateManager';
import { memoryGraph } from '../memory/MemoryGraph';
import { agentManager } from '../agents/AgentManager';
import { PriorityQueue } from './PriorityQueue';
import { GoogleGenAI } from '@google/genai';

const logger = createLogger('CognitiveEngine');
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export class CognitiveEngine {
  private isRunning: boolean = false;
  private loopInterval: number = 2000; // 2 seconds
  private taskQueue: PriorityQueue;
  private lastTick: number = Date.now();

  constructor() {
    this.taskQueue = new PriorityQueue();
    this.init();
  }

  private init() {
    eventBus.on('*', (event) => {
      // Feed all events into the cognitive loop for processing
      this.taskQueue.enqueue({
        id: event.id,
        event,
        priority: event.priority === 'critical' ? 100 : event.priority === 'high' ? 50 : 10,
        timestamp: event.timestamp
      });
    });
    logger.info('Cognitive Engine initialized.');
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
    logger.info('Cognitive Loop started.');
  }

  public stop() {
    this.isRunning = false;
    logger.info('Cognitive Loop stopped.');
  }

  private async loop() {
    if (!this.isRunning) return;

    const now = Date.now();
    const delta = now - this.lastTick;
    this.lastTick = now;

    try {
      // 1. Check System State
      const currentState = stateManager.getState();
      if (currentState === SystemState.CRITICAL || currentState === SystemState.SLEEP) {
        // Skip processing or run minimal maintenance
        setTimeout(() => this.loop(), this.loopInterval);
        return;
      }

      // 2. Process High Priority Tasks
      while (!this.taskQueue.isEmpty()) {
        const task = this.taskQueue.dequeue();
        if (task) {
          // logger.debug(`Processing Task: ${task.event.type}`); // Reduce noise
          await this.processTask(task);
        }
        // Yield to prevent blocking
        if (Date.now() - now > 100) break; 
      }

      // 3. Maintenance (Decay Memory, Check Health)
      if (Math.random() < 0.05) { // ~Every 20 ticks (40s)
        await this.performMaintenance();
      }

      // 4. Proactive Thinking (Simulated)
      if (currentState === SystemState.IDLE && Math.random() < 0.01) { // Rare proactive thought
        this.triggerProactiveThought();
      }

    } catch (error) {
      logger.error('Cognitive Loop Error:', error);
    }

    setTimeout(() => this.loop(), this.loopInterval);
  }

  private async processTask(task: any) {
    const { event } = task;

    if (event.type === 'AI_INITIATIVE') {
      logger.info(`Handling Autonomous Initiative: ${event.payload.reason}`);
      
      // Delegate to Strategic Agent to decide what to do
      const strategy = await agentManager.delegateTask(
        `Analyze this initiative: ${event.payload.reason}. Context: ${JSON.stringify(event.payload.context)}`,
        {}, 
        3 // Autonomy Level 3
      );
      
      if (strategy.status === 'success') {
        logger.info('Strategic Agent proposed action:', strategy.result);
        // In a real system, we would execute this proposal
      }
    } else if (event.type === 'PROACTIVE_THOUGHT') {
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Generate a proactive system optimization idea based on current state. Keep it brief.",
          });
          logger.info(`System Thought: ${response.text}`);
          
          // Save thought to memory
          memoryGraph.addNode({
            type: 'concept',
            label: 'System Thought',
            data: { content: response.text },
            importance: 0.3
          });
        } catch (e) {
          logger.warn('Failed to generate proactive thought');
        }
      }
    }
  }

  private async performMaintenance() {
    logger.debug('Performing System Maintenance...');
    // Decay memory importance
    memoryGraph.decay(); 
    
    // Check agent health (mock)
    // agentManager.checkHealth();
  }

  private triggerProactiveThought() {
    logger.info('Triggering Proactive Thought...');
    eventBus.publish({
      id: `thought-${Date.now()}`,
      type: 'PROACTIVE_THOUGHT',
      payload: { topic: 'System Optimization' },
      priority: 'low',
      timestamp: Date.now(),
      source: 'CognitiveEngine'
    });
  }
}

export const cognitiveEngine = new CognitiveEngine();
