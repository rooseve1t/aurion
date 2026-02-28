export enum RequestType {
  PLANNING = "PLANNING",
  ANALYSIS = "ANALYSIS",
  ACTION = "ACTION",
  HEALTH = "HEALTH",
  SECURITY = "SECURITY",
  GENERAL = "GENERAL",
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

export interface OrchestratorContext {
  command: string;
  requestType: RequestType;
  priority: PriorityLevel;
  deadline?: string;
  source: SourceType;
  currentSystemState: any; // Existing context from App.tsx
  relevantMemories: any[];
  relevantKnowledge: any[];
  recentUserActions: any[];
  agentHistory: DecisionTraceEntry[];
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
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'processing' | 'offline';
  efficiency: number;
  lastActivity: string;
  capabilities: string[];
  priorityWeight: number; // New: for arbitration
}

export interface SystemStatus {
  status: 'online' | 'offline';
  engine: string;
  core: string;
  uptime: number;
  metrics: Metrics;
  agents: { agents: Agent[] };
}

export interface Metrics {
  cpuUsage: number;
  ramUsage: number;
  networkLatency: number;
  activeThreads: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  preferences: {
    theme: string;
    voiceAssistant: boolean;
  };
}

export interface MemoryItem {
  id: number | string;
  type: string;
  content: string;
  metadata?: any;
  timestamp: string;
}

export interface KnowledgeItem {
  id: number;
  subject: string;
  predicate: string;
  object: string;
  metadata?: any;
}

export interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  room: string;
}

export interface HealthStats {
  heartRate: number;
  bloodPressure: string;
  sleepHours: number;
  activityLevel: string;
  lastUpdated: string;
}

export interface DigitalTwin {
  productivityScore: number;
  stabilityScore: number;
  cognitiveLoadScore: number;
  sleepQuality: number;
  focusPeaks: string[];
}

export interface FinanceStats {
  balance: number;
  investments: number;
  spending: number;
  currency: string;
}

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  link?: string;
  pubDate?: string;
}

export interface MusicState {
  playing: boolean;
  track: string;
  artist: string;
  duration: number;
  progress: number;
}

export interface LogEntry {
  time: string;
  message: string;
  type: 'info' | 'action' | 'error';
  agent?: string;
  tone?: string;
}
