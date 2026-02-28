// AURION OS — Central State Store
// Bioluminescent Deep Space HUD design system
// All system state lives here; every action propagates through the entire HUD

import { useState, useCallback, useRef, useEffect } from 'react';
import { jarVoiceEngine } from '@/services/geminiService';
import { toast } from 'sonner';

export type SystemMode = 'NORMAL' | 'GUARDIAN' | 'EMERGENCY' | 'SLEEP' | 'FOCUS';
export type ThreatLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ModuleId =
  | 'core' | 'voice' | 'memory' | 'security' | 'smarthome'
  | 'health' | 'reminders' | 'twin' | 'autonomy' | 'social'
  | 'multimedia' | 'analytics';

export interface SystemMetrics {
  aiLoad: number;           // 0-100
  systemIntegrity: number;  // 0-100
  riskScore: number;        // 0-100
  confidenceScore: number;  // 0-100
  autonomyLevel: number;    // 0-100
  memoryUsage: number;      // 0-100
}

export interface DigitalTwin {
  productivityIndex: number;  // 0-100
  stressIndex: number;        // 0-100
  riskTolerance: number;      // 0-100
  behavioralPattern: string;
  decisionTendency: string;
  emotionalBaseline: string;
  healthScore: number;        // 0-100
}

export interface HealthData {
  heartRate: number;
  sleepScore: number;
  stressLevel: number;
  activityLevel: number;
  healthIndex: number;
}

export interface SmartHomeDevice {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'camera' | 'sensor';
  status: boolean;
  value?: number;
  room: string;
}

export interface MemoryEntry {
  id: string;
  type: 'short' | 'long' | 'episodic';
  content: string;
  timestamp: string;
  emotionalTag?: 'positive' | 'neutral' | 'negative' | 'critical';
  importance: number;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'active' | 'done' | 'ignored';
  escalations: number;
}

export interface EventLog {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'ai';
  module: string;
  message: string;
  timestamp: string;
}

export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  lastCommand: string;
  transcript: string;
  history: Array<{ role: 'user' | 'jarvoice'; text: string; time: string }>;
}

export interface AurionState {
  // System
  systemMode: SystemMode;
  threatLevel: ThreatLevel;
  activeModule: ModuleId;
  isBooting: boolean;
  bootProgress: number;

  // Metrics
  metrics: SystemMetrics;
  digitalTwin: DigitalTwin;
  healthData: HealthData;

  // Modules
  smartHomeDevices: SmartHomeDevice[];
  memories: MemoryEntry[];
  reminders: Reminder[];
  eventLog: EventLog[];
  voice: VoiceState;

  // Smart home presets
  activePreset: 'home' | 'away' | 'night' | 'focus';

  // Security
  guardianMode: boolean;
  cameraFeed: boolean;
  alarmArmed: boolean;

  // Multimedia
  nowPlaying: { title: string; artist: string; playing: boolean } | null;

  // Autonomy suggestions
  autonomySuggestions: Array<{ id: string; text: string; priority: 'low' | 'medium' | 'high'; accepted: boolean | null }>;
  
  // Sentient Mode
  autonomyLevel: number; // 0-4
  emotionalState: string;
  stressLevel: number;
  latestDecisionTrace: any[];
}

const initialState: AurionState = {
  systemMode: 'NORMAL',
  threatLevel: 'NONE',
  activeModule: 'core',
  isBooting: true,
  bootProgress: 0,

  metrics: {
    aiLoad: 34,
    systemIntegrity: 97,
    riskScore: 12,
    confidenceScore: 89,
    autonomyLevel: 72,
    memoryUsage: 45,
  },

  digitalTwin: {
    productivityIndex: 78,
    stressIndex: 23,
    riskTolerance: 65,
    behavioralPattern: 'Analytical-Proactive',
    decisionTendency: 'Data-Driven',
    emotionalBaseline: 'Stable',
    healthScore: 84,
  },

  healthData: {
    heartRate: 68,
    sleepScore: 82,
    stressLevel: 23,
    activityLevel: 61,
    healthIndex: 84,
  },

  smartHomeDevices: [
    { id: 'light-living', name: 'Living Room', type: 'light', status: true, value: 70, room: 'Living Room' },
    { id: 'light-bedroom', name: 'Bedroom', type: 'light', status: false, value: 40, room: 'Bedroom' },
    { id: 'light-office', name: 'Office', type: 'light', status: true, value: 90, room: 'Office' },
    { id: 'thermo-main', name: 'Climate', type: 'thermostat', status: true, value: 22, room: 'Main' },
    { id: 'lock-front', name: 'Front Door', type: 'lock', status: true, room: 'Entrance' },
    { id: 'lock-back', name: 'Back Door', type: 'lock', status: true, room: 'Entrance' },
    { id: 'cam-front', name: 'Front Cam', type: 'camera', status: true, room: 'Exterior' },
    { id: 'cam-back', name: 'Back Cam', type: 'camera', status: true, room: 'Exterior' },
    { id: 'sensor-smoke', name: 'Smoke Sensor', type: 'sensor', status: true, room: 'Kitchen' },
    { id: 'sensor-motion', name: 'Motion Sensor', type: 'sensor', status: true, room: 'Hallway' },
  ],

  memories: [
    { id: 'm1', type: 'short', content: 'User reviewed Q4 analytics report', timestamp: '14:32', emotionalTag: 'neutral', importance: 6 },
    { id: 'm2', type: 'episodic', content: 'Morning workout completed — 45 min cardio', timestamp: '08:15', emotionalTag: 'positive', importance: 7 },
    { id: 'm3', type: 'long', content: 'Preference: dark mode, notifications muted 22:00–07:00', timestamp: '3 days ago', emotionalTag: 'neutral', importance: 9 },
    { id: 'm4', type: 'short', content: 'Missed reminder: Call Dr. Petrov', timestamp: '11:00', emotionalTag: 'negative', importance: 8 },
    { id: 'm5', type: 'episodic', content: 'High stress detected during 15:00–16:30 meeting', timestamp: 'Yesterday', emotionalTag: 'negative', importance: 7 },
    { id: 'm6', type: 'long', content: 'Behavioral pattern: peak productivity 09:00–12:00', timestamp: '1 week ago', emotionalTag: 'positive', importance: 9 },
  ],

  reminders: [
    { id: 'r1', title: 'Team standup', time: '09:00', priority: 'high', status: 'done', escalations: 0 },
    { id: 'r2', title: 'Take medication', time: '13:00', priority: 'critical', status: 'active', escalations: 1 },
    { id: 'r3', title: 'Review security logs', time: '15:00', priority: 'medium', status: 'pending', escalations: 0 },
    { id: 'r4', title: 'Call Dr. Petrov', time: '16:30', priority: 'high', status: 'ignored', escalations: 2 },
    { id: 'r5', title: 'Evening run', time: '19:00', priority: 'low', status: 'pending', escalations: 0 },
    { id: 'r6', title: 'System backup', time: '23:00', priority: 'medium', status: 'pending', escalations: 0 },
  ],

  eventLog: [
    { id: 'e1', type: 'ai', module: 'AUTONOMY', message: 'Proactive suggestion: Schedule recovery time after high-stress period', timestamp: '14:45' },
    { id: 'e2', type: 'success', module: 'HEALTH', message: 'Heart rate normalized — stress indicators declining', timestamp: '14:38' },
    { id: 'e3', type: 'warning', module: 'SECURITY', message: 'Motion detected at front entrance — verified as delivery', timestamp: '14:22' },
    { id: 'e4', type: 'info', module: 'MEMORY', message: 'Daily summary generated — 47 events indexed', timestamp: '14:00' },
    { id: 'e5', type: 'ai', module: 'TWIN', message: 'Digital Twin updated — productivity index +3 points', timestamp: '13:55' },
    { id: 'e6', type: 'success', module: 'SMARTHOME', message: 'Climate auto-adjusted to 22°C based on occupancy', timestamp: '13:30' },
    { id: 'e7', type: 'info', module: 'VOICE', message: 'JarVoice: Wake word detected — standby mode activated', timestamp: '13:15' },
    { id: 'e8', type: 'warning', module: 'REMINDER', message: 'Reminder escalated: Call Dr. Petrov — 2nd attempt', timestamp: '12:45' },
    { id: 'e9', type: 'ai', module: 'CORE', message: 'Decision Engine: Risk score recalculated — 12/100 (Low)', timestamp: '12:00' },
    { id: 'e10', type: 'success', module: 'SECURITY', message: 'Guardian mode active — all sensors nominal', timestamp: '11:30' },
  ],

  voice: {
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    lastCommand: '',
    transcript: '',
    history: [
      { role: 'jarvoice', text: 'AURION OS инициализирована. Все системы в норме. Добрый день.', time: '12:00' },
    ],
  },

  activePreset: 'home',
  guardianMode: true,
  cameraFeed: true,
  alarmArmed: true,

  nowPlaying: {
    title: 'Interstellar Main Theme',
    artist: 'Hans Zimmer',
    playing: false,
  },

  autonomySuggestions: [
    { id: 's1', text: 'Заблокировать входную дверь (открыта 2 часа)', priority: 'high', accepted: null },
    { id: 's2', text: 'Снизить яркость до 30% (циркадный ритм)', priority: 'medium', accepted: null },
    { id: 's3', text: 'Перенести звонок в 16:00 (обнаружен стресс)', priority: 'high', accepted: null },
  ],
  
  autonomyLevel: 2,
  emotionalState: 'neutral',
  stressLevel: 23,
  latestDecisionTrace: [],
};

export function useAurionStore() {
  const [state, setState] = useState<AurionState>(initialState);

  const updateMetrics = useCallback((delta: Partial<SystemMetrics>) => {
    setState(s => ({ ...s, metrics: { ...s.metrics, ...delta } }));
  }, []);

  const setActiveModule = useCallback((module: ModuleId) => {
    setState(s => ({ ...s, activeModule: module }));
  }, []);

  const setSystemMode = useCallback((mode: SystemMode) => {
    setState(s => {
      const newState = { ...s, systemMode: mode };
      // Mode changes affect metrics
      if (mode === 'GUARDIAN') {
        newState.metrics = { ...s.metrics, aiLoad: Math.min(100, s.metrics.aiLoad + 20), riskScore: Math.max(0, s.metrics.riskScore - 5) };
        newState.guardianMode = true;
        newState.alarmArmed = true;
      } else if (mode === 'EMERGENCY') {
        newState.threatLevel = 'HIGH';
        newState.metrics = { ...s.metrics, aiLoad: 95, riskScore: 85 };
      } else if (mode === 'SLEEP') {
        newState.metrics = { ...s.metrics, aiLoad: 8 };
      } else if (mode === 'FOCUS') {
        newState.metrics = { ...s.metrics, aiLoad: Math.min(100, s.metrics.aiLoad + 10), confidenceScore: Math.min(100, s.metrics.confidenceScore + 5) };
      } else {
        newState.metrics = { ...s.metrics, aiLoad: 34 };
        newState.threatLevel = 'NONE';
      }
      return newState;
    });
  }, []);

  const toggleDevice = useCallback((deviceId: string) => {
    setState(s => ({
      ...s,
      smartHomeDevices: s.smartHomeDevices.map(d =>
        d.id === deviceId ? { ...d, status: !d.status } : d
      ),
      eventLog: [
        {
          id: `e${Date.now()}`,
          type: 'info',
          module: 'SMARTHOME',
          message: `Device ${s.smartHomeDevices.find(d => d.id === deviceId)?.name} toggled`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
        ...s.eventLog.slice(0, 19),
      ],
    }));
  }, []);

  const setDeviceValue = useCallback((deviceId: string, value: number) => {
    setState(s => ({
      ...s,
      smartHomeDevices: s.smartHomeDevices.map(d =>
        d.id === deviceId ? { ...d, value } : d
      ),
    }));
  }, []);

  const setPreset = useCallback((preset: 'home' | 'away' | 'night' | 'focus') => {
    setState(s => {
      let devices = [...s.smartHomeDevices];
      if (preset === 'away') {
        devices = devices.map(d => d.type === 'light' ? { ...d, status: false } : d);
        devices = devices.map(d => d.type === 'lock' ? { ...d, status: true } : d);
      } else if (preset === 'night') {
        devices = devices.map(d => d.type === 'light' ? { ...d, status: false, value: 10 } : d);
        devices = devices.map(d => d.id === 'light-bedroom' ? { ...d, status: true, value: 5 } : d);
        devices = devices.map(d => d.id === 'thermo-main' ? { ...d, value: 19 } : d);
      } else if (preset === 'focus') {
        devices = devices.map(d => d.id === 'light-office' ? { ...d, status: true, value: 100 } : d);
        devices = devices.map(d => d.type === 'light' && d.id !== 'light-office' ? { ...d, status: false } : d);
      } else {
        devices = devices.map(d => d.id === 'light-living' ? { ...d, status: true, value: 70 } : d);
        devices = devices.map(d => d.id === 'light-office' ? { ...d, status: true, value: 90 } : d);
        devices = devices.map(d => d.id === 'thermo-main' ? { ...d, value: 22 } : d);
      }
      return {
        ...s,
        activePreset: preset,
        smartHomeDevices: devices,
        eventLog: [
          {
            id: `e${Date.now()}`,
            type: 'success',
            module: 'SMARTHOME',
            message: `Preset activated: ${preset.toUpperCase()} mode`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          },
          ...s.eventLog.slice(0, 19),
        ],
      };
    });
  }, []);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Proactive Loop: Self-Initiation
  useEffect(() => {
    const proactiveInterval = setInterval(async () => {
      const s = stateRef.current;
      // Only initiate if autonomy level is high enough (> 1) and not currently busy
      if (s.autonomyLevel < 2 || s.voice.isListening || s.voice.isProcessing || s.voice.isSpeaking) return;

      // Random chance to initiate (simulated "thought")
      // In a real system, this would be driven by event triggers or anomaly detection
      if (Math.random() > 0.95) { // 5% chance every check
         const insight = await jarVoiceEngine.getProactiveInsight(s);
         if (insight && insight.insight) {
            const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            
            setState(prev => ({
              ...prev,
              voice: {
                ...prev.voice,
                history: [...prev.voice.history, { role: 'jarvoice' as const, text: insight.insight, time }].slice(-20),
              },
              eventLog: [
                { 
                  id: `e${Date.now()}`, 
                  type: 'ai', 
                  module: 'AUTONOMY', 
                  message: `Self-Initiated: ${insight.insight}`, 
                  timestamp: time 
                },
                ...prev.eventLog.slice(0, 19),
              ]
            }));
            toast.info(`AURION: ${insight.insight}`);
         }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(proactiveInterval);
  }, []);

  const toggleVoice = useCallback(() => {
    setState(s => ({
      ...s,
      voice: { ...s.voice, isListening: !s.voice.isListening },
      metrics: { ...s.metrics, aiLoad: !s.voice.isListening ? Math.min(100, s.metrics.aiLoad + 15) : Math.max(0, s.metrics.aiLoad - 15) },
    }));
  }, []);

  const sendVoiceCommand = useCallback(async (command: string) => {
    const currentState = stateRef.current;
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    // 1. Optimistic update: User message & Processing state
    setState(s => ({
      ...s,
      voice: {
        ...s.voice,
        isProcessing: true,
        lastCommand: command,
        history: [...s.voice.history, { role: 'user' as const, text: command, time }].slice(-20),
      }
    }));

    // 2. Call Gemini API via Service
    const result = await jarVoiceEngine.processCommand(
      command,
      currentState,
      currentState.autonomyLevel,
      currentState.emotionalState,
      currentState.stressLevel
    );

    // 3. Process Result & Execute Actions
    setState(s => {
      const newState = { ...s };
      
      // Update Voice History with AI Response
      // Note: We re-add user message to ensure order if state changed, but actually we just append AI response
      // to the *current* history which already has the user message from step 1? 
      // No, step 1 updated state, so 's' here has the user message.
      newState.voice = {
        ...s.voice,
        isProcessing: false,
        isListening: false,
        history: [...s.voice.history, { role: 'jarvoice' as const, text: result.response, time }].slice(-20),
      };

      // Update Event Log
      newState.eventLog = [
        { 
          id: `e${Date.now()}`, 
          type: 'ai', 
          module: 'CORE', 
          message: `Decision: ${result.action || 'RESPONSE'} (${result.agentRole || 'ORCHESTRATOR'})`, 
          timestamp: time 
        },
        ...s.eventLog.slice(0, 19),
      ];

      // Update Decision Trace
      if (result.decisionTrace) {
        newState.latestDecisionTrace = result.decisionTrace;
      }

      // Execute Actions
      if (result.action === 'TOGGLE_DEVICE' && result.actionData?.id) {
         newState.smartHomeDevices = s.smartHomeDevices.map(d => 
           d.id === result.actionData.id ? { ...d, status: !d.status } : d
         );
      } else if (result.action === 'ACTIVATE_PROTOCOL') {
         const protocol = result.actionData?.protocol;
         if (protocol === 'guardian') {
            newState.systemMode = 'GUARDIAN';
            newState.guardianMode = true;
         } else if (protocol === 'emergency') {
            newState.systemMode = 'EMERGENCY';
            newState.threatLevel = 'CRITICAL';
         } else if (protocol === 'focus') {
            newState.systemMode = 'FOCUS';
         } else if (protocol === 'sleep') {
            newState.systemMode = 'SLEEP';
         }
      }

      return newState;
    });
  }, []);

  const completeReminder = useCallback((id: string) => {
    setState(s => ({
      ...s,
      reminders: s.reminders.map(r => r.id === id ? { ...r, status: 'done' as const } : r),
    }));
  }, []);

  const addReminder = useCallback((title: string, time: string, priority: Reminder['priority']) => {
    setState(s => ({
      ...s,
      reminders: [
        ...s.reminders,
        { id: `r${Date.now()}`, title, time, priority, status: 'pending', escalations: 0 },
      ],
    }));
  }, []);

  const acceptSuggestion = useCallback((id: string, accept: boolean) => {
    setState(s => ({
      ...s,
      autonomySuggestions: s.autonomySuggestions.map(a => a.id === id ? { ...a, accepted: accept } : a),
      eventLog: [
        {
          id: `e${Date.now()}`,
          type: accept ? 'success' : 'info',
          module: 'AUTONOMY',
          message: accept ? 'Autonomy suggestion accepted and executed' : 'Autonomy suggestion dismissed',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
        ...s.eventLog.slice(0, 19),
      ],
    }));
  }, []);

  const triggerEmergency = useCallback(() => {
    setState(s => ({
      ...s,
      systemMode: 'EMERGENCY',
      threatLevel: 'CRITICAL',
      metrics: { ...s.metrics, aiLoad: 98, riskScore: 95 },
      eventLog: [
        { id: `e${Date.now()}`, type: 'danger', module: 'SECURITY', message: '🚨 EMERGENCY PROTOCOL ACTIVATED — Contacting emergency services', timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
        ...s.eventLog.slice(0, 19),
      ],
    }));
  }, []);

  const dismissEmergency = useCallback(() => {
    setState(s => ({
      ...s,
      systemMode: 'NORMAL',
      threatLevel: 'NONE',
      metrics: { ...s.metrics, aiLoad: 34, riskScore: 12 },
    }));
  }, []);

  const toggleGuardian = useCallback(() => {
    setState(s => ({
      ...s,
      guardianMode: !s.guardianMode,
      metrics: { ...s.metrics, aiLoad: !s.guardianMode ? Math.min(100, s.metrics.aiLoad + 15) : Math.max(10, s.metrics.aiLoad - 15) },
    }));
  }, []);

  const toggleNowPlaying = useCallback(() => {
    setState(s => ({
      ...s,
      nowPlaying: s.nowPlaying ? { ...s.nowPlaying, playing: !s.nowPlaying.playing } : null,
    }));
  }, []);

  const setAutonomyLevel = useCallback((level: number) => {
    setState(s => ({
      ...s,
      autonomyLevel: level,
      eventLog: [
        { id: `e${Date.now()}`, type: 'ai', module: 'AUTONOMY', message: `Уровень автономности изменен на Level ${level}`, timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) },
        ...s.eventLog.slice(0, 19),
      ],
    }));
  }, []);

  const finishBoot = useCallback(() => {
    setState(s => ({ ...s, isBooting: false, bootProgress: 100 }));
  }, []);

  const setBootProgress = useCallback((progress: number) => {
    setState(s => ({ ...s, bootProgress: progress }));
  }, []);

  return {
    state,
    updateMetrics,
    setActiveModule,
    setSystemMode,
    toggleDevice,
    setDeviceValue,
    setPreset,
    toggleVoice,
    sendVoiceCommand,
    completeReminder,
    addReminder,
    acceptSuggestion,
    triggerEmergency,
    dismissEmergency,
    toggleGuardian,
    toggleNowPlaying,
    finishBoot,
    setBootProgress,
    setAutonomyLevel,
  };
}

export type AurionStore = ReturnType<typeof useAurionStore>;
