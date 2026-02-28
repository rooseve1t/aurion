import { PlannerAgent } from './PlannerAgent';
import { ResearchAgent } from './ResearchAgent';
import { OrchestratorAgent } from './OrchestratorAgent';
import { ExecutionAgent } from './ExecutionAgent';
import { AutomationAgent } from './AutomationAgent';
import { HealthAgent } from './HealthAgent';
import { SecurityAgent } from './SecurityAgent';
import { StrategicAgent } from './StrategicAgent';

export const agents = {
  planner: new PlannerAgent(),
  research: new ResearchAgent(),
  orchestrator: new OrchestratorAgent(),
  execution: new ExecutionAgent(),
  automation: new AutomationAgent(),
  health: new HealthAgent(),
  security: new SecurityAgent(),
  strategic: new StrategicAgent(),
};

export type AgentType = keyof typeof agents;
