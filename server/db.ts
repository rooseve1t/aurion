
import { User, Agent, MemoryNode, MemoryEdge, SystemMetrics, DigitalTwin, RequestType } from './types';

export const db = {
  users: [
    { id: 1, username: "admin", password: "password", name: "Tony Stark", role: "admin", avatar: "https://i.pravatar.cc/150?u=tony", permissions: ['all'] }
  ] as User[],
  
  agents: [
    { id: 'agent-planner', type: 'planner', name: 'Strategic Planner', status: 'idle', efficiency: 95, lastActivity: new Date().toISOString(), capabilities: [RequestType.PLANNING, RequestType.GENERAL], priorityWeight: 80 },
    { id: 'agent-research', type: 'research', name: 'Research Agent', status: 'idle', efficiency: 88, lastActivity: new Date().toISOString(), capabilities: [RequestType.RESEARCH, RequestType.ANALYSIS, RequestType.GENERAL], priorityWeight: 70 },
    { id: 'agent-execution', type: 'execution', name: 'Execution Agent', status: 'idle', efficiency: 92, lastActivity: new Date().toISOString(), capabilities: [RequestType.ACTION, RequestType.GENERAL], priorityWeight: 90 },
    { id: 'agent-health', type: 'health', name: 'Health Agent', status: 'idle', efficiency: 90, lastActivity: new Date().toISOString(), capabilities: [RequestType.HEALTH, RequestType.ANALYSIS], priorityWeight: 75 },
    { id: 'agent-security', type: 'security', name: 'Security Agent', status: 'idle', efficiency: 99, lastActivity: new Date().toISOString(), capabilities: [RequestType.SECURITY, RequestType.ACTION, RequestType.ANALYSIS], priorityWeight: 95 }
  ] as Agent[],

  memoryGraph: {
    nodes: [
      // Entities
      { id: 'user-1', type: 'user', label: 'Tony Stark', data: { role: 'admin' }, timestamp: new Date().toISOString() },
      { id: 'project-aurion', type: 'project', label: 'Project AURION', data: { status: 'active' }, timestamp: new Date().toISOString() },
      
      // Agents
      { id: 'agent-core', type: 'decision', label: 'CORE ORCHESTRATOR', data: { version: '3.0' }, timestamp: new Date().toISOString() },
      { id: 'agent-sec', type: 'decision', label: 'SECURITY AGENT', data: { status: 'active' }, timestamp: new Date().toISOString() },
      
      // Devices
      { id: 'device-1', type: 'device', label: 'Living Room Lights', data: { status: 'on' }, timestamp: new Date().toISOString() },
      { id: 'device-5', type: 'device', label: 'Jarvis Watch', data: { battery: 82 }, timestamp: new Date().toISOString() },
      
      // Concepts / Metrics
      { id: 'concept-safety', type: 'metric', label: 'Safety Protocol', data: { level: 'high' }, timestamp: new Date().toISOString() },
      { id: 'concept-health', type: 'metric', label: 'Biometrics', data: { bpm: 72 }, timestamp: new Date().toISOString() },
      
      // Recent Events
      { id: 'evt-boot', type: 'event', label: 'System Boot', data: { duration: '1.2s' }, timestamp: new Date().toISOString() },
      { id: 'evt-scan', type: 'interaction', label: 'Morning Scan', data: { result: 'clean' }, timestamp: new Date().toISOString() }
    ] as MemoryNode[],
    edges: [
      { source: 'user-1', target: 'project-aurion', relation: 'owns', weight: 1.0 },
      { source: 'user-1', target: 'device-1', relation: 'controls', weight: 0.8 },
      { source: 'user-1', target: 'device-5', relation: 'wears', weight: 0.9 },
      { source: 'agent-core', target: 'project-aurion', relation: 'manages', weight: 1.0 },
      { source: 'agent-core', target: 'agent-sec', relation: 'delegates', weight: 0.7 },
      { source: 'agent-sec', target: 'concept-safety', relation: 'enforces', weight: 0.9 },
      { source: 'device-5', target: 'concept-health', relation: 'monitors', weight: 0.8 },
      { source: 'evt-boot', target: 'agent-core', relation: 'initiated_by', weight: 0.5 },
      { source: 'evt-scan', target: 'agent-sec', relation: 'performed_by', weight: 0.6 }
    ] as MemoryEdge[]
  },

  systemMetrics: {
    cpuUsage: 12,
    ramUsage: 45,
    networkLatency: 24,
    activeThreads: 156
  } as SystemMetrics,

  digitalTwin: {
    productivityScore: 85,
    stabilityScore: 92,
    cognitiveLoadScore: 45,
    sleepQuality: 78,
    focusPeaks: ['10:00', '14:30', '20:00']
  } as DigitalTwin,

  privacyMode: 'hybrid', // 'cloud', 'hybrid', 'local'
  
  auditLogs: [] as any[],
  
  // Legacy support
  memories: [] as any[],
  knowledge: [] as any[],
  devices: [] as any[],
  health: {} as any,
  finance: {} as any,
  music: {} as any
};

// Initialize legacy data
db.memories = [
  { id: 1, type: 'short', content: 'System initialized.', timestamp: new Date().toISOString() }
];
db.knowledge = [
  { id: 1, subject: 'User', predicate: 'works_at', object: 'Stark Industries' }
];
db.devices = [
  { id: 1, name: "Living Room Lights", status: "on", brightness: 80, type: "light" },
  { id: 2, name: "Thermostat", status: "active", temperature: 22, type: "climate" },
  { id: 3, name: "Main Lock", status: "locked", type: "security" },
  { id: 4, name: "Bedroom Blinds", status: "closed", type: "cover" },
  { id: 5, name: "Jarvis Watch Ultra", status: "connected", battery: 82, type: "wearable", lastSync: "Just now" },
  { id: 6, name: "Stark Pods Pro", status: "connected", battery: 100, type: "audio", mode: "noise_cancelling" },
  { id: 7, name: "Studio Speaker", status: "idle", volume: 45, type: "speaker" }
];
db.health = {
  steps: 8420,
  heartRate: 72,
  sleepQuality: "85%",
  stressLevel: "Low",
  lastUpdated: new Date().toISOString()
};
db.finance = {
  balance: 12450000.75,
  currency: "USD",
  recentTransactions: [
    { id: 1, merchant: "Stark Industries R&D", amount: -50000.00, date: "2026-02-19" },
    { id: 2, merchant: "Avengers Fund", amount: 1000000.00, date: "2026-02-15" }
  ]
};
db.music = {
  playing: false,
  track: "Driving with the Top Down",
  artist: "Ramin Djawadi",
  progress: 0,
  duration: 180
};
