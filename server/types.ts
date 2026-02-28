
export type Role = 'admin' | 'user' | 'observer';
export type PrivacyMode = 'cloud' | 'hybrid' | 'local';
export type AgentStatus = 'idle' | 'active' | 'processing' | 'error' | 'offline';
export type AgentType = 'planner' | 'research' | 'execution' | 'health' | 'security' | 'orchestrator' | 'automation';

export enum RequestType {
  PLANNING = "PLANNING",
  ANALYSIS = "ANALYSIS",
  ACTION = "ACTION",
  HEALTH = "HEALTH",
  SECURITY = "SECURITY",
  GENERAL = "GENERAL",
  RESEARCH = "RESEARCH",
}

export enum PriorityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum SourceType {
  USER = "USER",
  AUTONOMY = "AUTONOMY",
  SYSTEM = "SYSTEM",
}

export interface DecisionTraceEntry {
  agentId: string;
  agentType: string;
  decisionLogic: string;
  dataUsed: any;
  actionTaken: string;
  timestamp: string;
}

export enum AutonomyLevel {
  LEVEL_0 = 0, // Только ответы
  LEVEL_1 = 1, // Предложения
  LEVEL_2 = 2, // Действия после уведомления
  LEVEL_3 = 3, // Самостоятельные действия
  LEVEL_4 = 4, // Критические автономные протоколы
}

export interface OrchestratorContext {
  command: string;
  requestType: RequestType;
  priority: PriorityLevel;
  deadline?: string;
  source: SourceType;
  currentSystemState: any;
  relevantMemories: any[];
  relevantKnowledge: any[];
  recentUserActions: any[];
  agentHistory: DecisionTraceEntry[];
  autonomyLevel: AutonomyLevel;
  userEmotionalState?: string;
  userStressLevel?: number;
}

export interface OrchestratorResponse {
  response: string;
  action: string;
  actionData?: any;
  thought: string;
  agentRole: string;
  emotionalTone: string;
  decisionTrace: DecisionTraceEntry[];
  finalPriority: PriorityLevel;
  proactiveInitiation?: boolean;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  name: string;
  role: Role;
  avatar: string;
  permissions: string[];
}

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  status: AgentStatus;
  lastAction?: string;
  efficiency: number;
  lastActivity?: string;
  lastFailure?: string;
  capabilities: string[];
  priorityWeight: number;
}

export interface MemoryNode {
  id: string;
  type: 'user' | 'project' | 'task' | 'metric' | 'device' | 'interaction' | 'decision' | 'event';
  label: string;
  data: any;
  timestamp: string;
}

export interface MemoryEdge {
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export interface SystemMetrics {
  cpuUsage: number;
  ramUsage: number;
  networkLatency: number;
  activeThreads: number;
}

export interface DigitalTwin {
  productivityScore: number;
  stabilityScore: number;
  cognitiveLoadScore: number;
  sleepQuality: number;
  focusPeaks: string[];
}
