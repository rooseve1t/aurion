
import { dbService } from '../services/DatabaseService';
import { Agent, RequestType, PriorityLevel, SourceType, OrchestratorContext, DecisionTraceEntry, AgentType, AgentStatus } from '../types';
import { BaseAgent } from './BaseAgent';
import { PlannerAgent } from './PlannerAgent';
import { ResearchAgent } from './ResearchAgent';
import { ExecutionAgent } from './ExecutionAgent';
import { StrategicAgent } from './StrategicAgent';
import { AutomationAgent } from './AutomationAgent';
import { HealthAgent } from './HealthAgent';
import { SecurityAgent } from './SecurityAgent';
import { createLogger } from '../core/Logger';
import { orchestrator } from '../core/Orchestrator';

const logger = createLogger('AgentManager');

export class AgentManager {
  private agents: Map<string, BaseAgent> = new Map();
  private agentMetadata: Map<string, Agent> = new Map(); // Metadata for UI/Selection
  private decisionLog: DecisionTraceEntry[] = [];
  private taskCache: Map<string, { timestamp: number, result: any }> = new Map();

  constructor() {
    this.initAgents();
  }

  private initAgents() {
    // Initialize Real Agents
    this.registerAgent(new PlannerAgent(), {
      id: 'agent-planner', type: 'planner', name: 'Strategic Planner', status: 'idle', efficiency: 95, capabilities: [RequestType.PLANNING, RequestType.GENERAL], priorityWeight: 80
    });
    this.registerAgent(new ResearchAgent(), {
      id: 'agent-research', type: 'research', name: 'Research Agent', status: 'idle', efficiency: 88, capabilities: [RequestType.RESEARCH, RequestType.ANALYSIS, RequestType.GENERAL], priorityWeight: 70
    });
    this.registerAgent(new ExecutionAgent(), {
      id: 'agent-execution', type: 'execution', name: 'Execution Agent', status: 'idle', efficiency: 92, capabilities: [RequestType.ACTION, RequestType.GENERAL], priorityWeight: 90
    });
    this.registerAgent(new StrategicAgent(), {
      id: 'agent-strategic', type: 'orchestrator', name: 'Strategic Agent', status: 'idle', efficiency: 99, capabilities: [RequestType.ANALYSIS, RequestType.SECURITY], priorityWeight: 95
    });
    this.registerAgent(new AutomationAgent(), {
      id: 'automation-agent', type: 'automation', name: 'Automation Agent', status: 'idle', efficiency: 90, capabilities: [RequestType.ACTION], priorityWeight: 60
    });
    this.registerAgent(new HealthAgent(), {
      id: 'health-agent', type: 'health', name: 'Health Agent', status: 'idle', efficiency: 95, capabilities: [RequestType.HEALTH], priorityWeight: 85
    });
    this.registerAgent(new SecurityAgent(), {
      id: 'security-agent', type: 'security', name: 'Security Agent', status: 'idle', efficiency: 99, capabilities: [RequestType.SECURITY], priorityWeight: 100
    });
  }

  private registerAgent(instance: BaseAgent, metadata: Partial<Agent>) {
    const id = instance.getId(); 
    this.agents.set(id, instance);
    
    this.agentMetadata.set(id, {
      id,
      type: metadata.type as AgentType,
      name: metadata.name || 'Unknown Agent',
      status: 'idle',
      efficiency: metadata.efficiency || 80,
      capabilities: metadata.capabilities || [],
      priorityWeight: metadata.priorityWeight || 50,
      lastActivity: new Date().toISOString()
    });
    
    // Register with Orchestrator for event handling
    orchestrator.registerAgent(instance);
    
    logger.info(`Registered agent: ${metadata.name} [${id}]`);
  }

  getAgent(type: AgentType): Agent | undefined {
    // Return metadata for UI
    return Array.from(this.agentMetadata.values()).find(a => a.type === type);
  }

  getAgentInstance(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  updateStatus(id: string, status: AgentStatus, action?: string) {
    const agent = this.agentMetadata.get(id);
    if (agent) {
      agent.status = status;
      agent.lastActivity = new Date().toISOString();
      if (action) agent.lastAction = action;
      // Simulate efficiency fluctuation
      agent.efficiency = Math.min(100, Math.max(50, agent.efficiency + (Math.random() * 5 - 2.5)));
    }
  }

  markAgentFailure(id: string) {
    const agent = this.agentMetadata.get(id);
    if (agent) {
      agent.lastFailure = new Date().toISOString();
      agent.efficiency = Math.max(0, agent.efficiency - 10); // Penalty for failure
    }
  }

  addDecisionTrace(entry: DecisionTraceEntry) {
    this.decisionLog.push(entry);
    // Keep log to a reasonable size
    if (this.decisionLog.length > 100) {
      this.decisionLog.shift();
    }
    
    // Persist to DB
    try {
      dbService.getDb().prepare(`
        INSERT INTO agent_logs (agent_id, action, result, timestamp)
        VALUES (?, ?, ?, ?)
      `).run(entry.agentId, entry.actionTaken, JSON.stringify(entry), Date.now());
    } catch (e) {
      logger.error('Failed to persist decision trace', e);
    }
  }

  getDecisionTrace(): DecisionTraceEntry[] {
    return this.decisionLog;
  }

  public determineRequestType(command: string): RequestType {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('план') || lowerCommand.includes('расписание') || lowerCommand.includes('задача')) return RequestType.PLANNING;
    if (lowerCommand.includes('анализ') || lowerCommand.includes('отчет') || lowerCommand.includes('статистика')) return RequestType.ANALYSIS;
    if (lowerCommand.includes('включи') || lowerCommand.includes('выключи') || lowerCommand.includes('открой') || lowerCommand.includes('закрой') || lowerCommand.includes('сделай')) return RequestType.ACTION;
    if (lowerCommand.includes('здоровье') || lowerCommand.includes('пульс') || lowerCommand.includes('сон')) return RequestType.HEALTH;
    if (lowerCommand.includes('безопасность') || lowerCommand.includes('замок') || lowerCommand.includes('камера')) return RequestType.SECURITY;
    if (lowerCommand.includes('найди') || lowerCommand.includes('узнай') || lowerCommand.includes('погугли')) return RequestType.RESEARCH;
    return RequestType.GENERAL;
  }

  public determinePriority(command: string, source: SourceType): PriorityLevel {
    const lowerCommand = command.toLowerCase();
    if (source === SourceType.USER && (lowerCommand.includes('срочно') || lowerCommand.includes('немедленно'))) return PriorityLevel.CRITICAL;
    if (source === SourceType.SYSTEM && (lowerCommand.includes('ошибка') || lowerCommand.includes('сбой'))) return PriorityLevel.CRITICAL;
    if (lowerCommand.includes('важно') || lowerCommand.includes('приоритет')) return PriorityLevel.HIGH;
    return PriorityLevel.MEDIUM;
  }

  private getSuitableAgents(requestType: RequestType, priority: PriorityLevel): Agent[] {
    const now = Date.now();
    const suitableAgents = Array.from(this.agentMetadata.values()).filter(agent => {
      if (!agent.capabilities.includes(requestType) && !agent.capabilities.includes(RequestType.GENERAL)) return false;
      if (agent.status === 'offline') return false;
      
      if (agent.lastFailure) {
        const timeSinceFailure = now - new Date(agent.lastFailure).getTime();
        if (timeSinceFailure < 30000) return false; // Skip if failed recently
      }
      return true;
    });

    // Arbitration: sort by priorityWeight and current efficiency
    suitableAgents.sort((a, b) => {
      const scoreA = a.priorityWeight * 0.7 + a.efficiency * 0.3;
      const scoreB = b.priorityWeight * 0.7 + b.efficiency * 0.3;
      return scoreB - scoreA;
    });

    return suitableAgents;
  }

  async delegateTask(command: string, currentSystemState: any, autonomyLevel: number = 0, emotionalState: string = 'neutral', stressLevel: number = 0): Promise<any> {
    const cacheKey = command.trim().toLowerCase();
    const cached = this.taskCache.get(cacheKey);
    
    // Performance Optimization: Cache frequent identical requests (valid for 5 seconds)
    if (cached && (Date.now() - cached.timestamp < 5000)) {
      return cached.result;
    }

    const requestType = this.determineRequestType(command);
    const priority = this.determinePriority(command, SourceType.USER);

    const orchestratorContext: OrchestratorContext = {
      command,
      requestType,
      priority,
      source: SourceType.USER,
      currentSystemState,
      relevantMemories: [],
      relevantKnowledge: [],
      recentUserActions: [],
      agentHistory: this.getDecisionTrace(),
      autonomyLevel,
      userEmotionalState: emotionalState,
      userStressLevel: stressLevel,
    };

    const suitableAgents = this.getSuitableAgents(requestType, priority);

    if (suitableAgents.length === 0) {
      return { agent: 'orchestrator', status: 'fallback', response: 'Не удалось найти подходящего агента. Оркестратор обработает запрос.' };
    }

    // Failover Routing Loop
    for (const selectedAgentMeta of suitableAgents) {
      const agentInstance = this.getAgentInstance(selectedAgentMeta.id);
      if (!agentInstance) continue;

      this.updateStatus(selectedAgentMeta.id, 'processing', `Handling: ${command.substring(0, 20)}...`);

      const traceEntry: DecisionTraceEntry = {
        agentId: selectedAgentMeta.id,
        agentType: selectedAgentMeta.type,
        decisionLogic: `Routed to ${selectedAgentMeta.name} (Priority Weight: ${selectedAgentMeta.priorityWeight}, Efficiency: ${selectedAgentMeta.efficiency}).`,
        dataUsed: orchestratorContext,
        actionTaken: 'DELEGATE_TASK',
        timestamp: new Date().toISOString(),
      };
      this.addDecisionTrace(traceEntry);

      try {
        // ACTUAL EXECUTION
        const result = await agentInstance.execute(command, currentSystemState);
        
        this.updateStatus(selectedAgentMeta.id, 'active', `Completed: ${command.substring(0, 20)}...`);
        setTimeout(() => this.updateStatus(selectedAgentMeta.id, 'idle'), 2000);
        
        const response = { agent: selectedAgentMeta.type, status: 'success', result, decisionTrace: this.getDecisionTrace() };
        
        // Cache successful result
        this.taskCache.set(cacheKey, { timestamp: Date.now(), result: response });
        
        return response;
      } catch (error) {
        this.updateStatus(selectedAgentMeta.id, 'idle', `Failed: ${command.substring(0, 20)}...`);
        this.markAgentFailure(selectedAgentMeta.id);
        
        this.addDecisionTrace({
          agentId: selectedAgentMeta.id,
          agentType: selectedAgentMeta.type,
          decisionLogic: `Agent ${selectedAgentMeta.name} failed. Error: ${(error as Error).message}. Attempting failover.`,
          dataUsed: orchestratorContext,
          actionTaken: 'AGENT_FAILURE_FAILOVER',
          timestamp: new Date().toISOString(),
        });
        // Continue to the next agent
      }
    }

    return { agent: 'orchestrator', status: 'failed', error: 'All agents failed', decisionTrace: this.getDecisionTrace() };
  }

  getSystemStatus() {
    return {
      agents: Array.from(this.agentMetadata.values()),
      overallEfficiency: Array.from(this.agentMetadata.values()).reduce((acc, curr) => acc + curr.efficiency, 0) / this.agentMetadata.size,
      decisionTrace: this.getDecisionTrace(),
    };
  }
}

export const agentManager = new AgentManager();
