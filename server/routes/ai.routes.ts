import express from 'express';
import { db } from '../db';
import { memoryGraph } from '../memory/MemoryGraph';
import { agentManager } from '../agents/AgentManager';
import { autonomousInitiative } from '../core/AutonomousInitiative';
import { characterEngine } from '../core/CharacterEngine';
import { protocolEngine } from '../core/ProtocolEngine';
import { systemAwareness } from '../core/SystemAwareness';
import { RequestType, PriorityLevel, SourceType, OrchestratorContext, OrchestratorResponse } from '../types';
import { GoogleGenAI } from '@google/genai';
import { safetyLayer } from '../core/SafetyLayer';
import { z } from 'zod';
import { ttsService } from '../services/TTSService';
import { voiceCommandExecutor } from '../services/VoiceCommandExecutor';

const router = express.Router();
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// Schemas
const commandSchema = z.object({
  command: z.string().min(1),
  context: z.any().optional(),
  autonomyLevel: z.number().min(0).max(5).default(0),
  emotionalState: z.string().default('neutral'),
  stressLevel: z.number().min(0).max(100).default(0)
});

// --- Routes ---

router.post('/command', async (req, res) => {
  const validation = safetyLayer.validateInput(commandSchema, req.body);
  if (!validation.success) return res.status(400).json({ error: validation.error });

  const { command, context, autonomyLevel, emotionalState, stressLevel } = validation.data;
  
  if (!ai) return res.status(503).json({ error: "AI Service Unavailable" });

  try {
    // 1. Determine Request Type, Priority, and Source
    const requestType = agentManager.determineRequestType(command);
    const priority = agentManager.determinePriority(command, SourceType.USER);

    // 2. Load Relevant Context
    const relevantMemories = await memoryGraph.search(command, 5);
    const relevantKnowledge = await memoryGraph.search(command, 5); // Assuming knowledge search is similar for now
    const recentUserActions = agentManager.getDecisionTrace().slice(-5);

    const orchestratorContext: OrchestratorContext = {
      command,
      requestType,
      priority,
      source: SourceType.USER,
      currentSystemState: context,
      relevantMemories,
      relevantKnowledge,
      recentUserActions,
      agentHistory: agentManager.getDecisionTrace(),
      autonomyLevel,
      userEmotionalState: emotionalState,
      userStressLevel: stressLevel,
    };

    // 3. Delegate to Agent Manager (Orchestrator)
    const delegationResult = await agentManager.delegateTask(command, orchestratorContext, autonomyLevel, emotionalState, stressLevel);

    // 3.5. Determine System Tone & Protocol
    const protocolStatus = protocolEngine.getStatus();
    if (protocolStatus.activeProtocol === 'EMERGENCY' || protocolStatus.activeProtocol === 'SECURITY') {
      characterEngine.setTone('CRISIS');
    } else if (protocolStatus.activeProtocol === 'STRATEGIC') {
      characterEngine.setTone('STRATEGIC');
    } else {
      characterEngine.setTone('NORMAL');
    }

    // 4. Update System Instruction for Gemini
    const systemInstruction = characterEngine.getSystemInstruction(autonomyLevel) + `
    
    ГЛАВНАЯ ДИРЕКТИВА:
    - Ты всегда отвечаешь на РУССКОМ ЯЗЫКЕ.
    - Ты не бот. Ты - Decision Engine. Ты анализируешь контекст, принимаешь решения и инициируешь действия.
    - Обращайся к пользователю уважительно, но как равный интеллект. Избегай клише "чем могу помочь".
    - Используй "Поток Сознания": если ты думаешь или анализируешь, кратко озвучивай это в поле 'thought'.
    
    ТЕКУЩИЙ ПРОТОКОЛ: ${protocolStatus.activeProtocol} (State: ${protocolStatus.state})
    
    СОСТОЯНИЕ ПОЛЬЗОВАТЕЛЯ:
    - Эмоциональное состояние: ${emotionalState}
    - Уровень стресса: ${stressLevel}%
    Адаптируй свой тон и эмпатию в зависимости от этих показателей. При высоком стрессе используй Crisis Mode (спокойный, медленный темп, четкие инструкции).
    
    РОЛИ АГЕНТОВ (Ты оркестратор, но также можешь выступать в роли агента):
    - PLANNER: ${JSON.stringify(agentManager.getAgent('planner'))}
    - RESEARCH: ${JSON.stringify(agentManager.getAgent('research'))}
    - EXECUTION: ${JSON.stringify(agentManager.getAgent('execution'))}
    - HEALTH: ${JSON.stringify(agentManager.getAgent('health'))}
    - SECURITY: ${JSON.stringify(agentManager.getAgent('security'))}
    
    КОНТЕКСТ ОРКЕСТРАТОРА:
    - Тип запроса: ${orchestratorContext.requestType}
    - Приоритет: ${orchestratorContext.priority}
    - Релевантная память: ${JSON.stringify(orchestratorContext.relevantMemories)}
    - Релевантные знания: ${JSON.stringify(orchestratorContext.relevantKnowledge)}
    - История решений агентов: ${JSON.stringify(orchestratorContext.agentHistory)}
    - Делегировано агенту: ${delegationResult.agent || 'Оркестратор'}
    
    ФОРМАТ ОТВЕТА (JSON):
    {
      "response": "Твой голосовой ответ на русском языке.",
      "action": "System action: 'SAVE_MEMORY', 'UPDATE_KG', 'SET_FOCUS', 'EVOLVE_SYSTEM', 'CHANGE_THEME', 'SEARCH_MAPS', 'TOGGLE_DEVICE', 'MUSIC_CONTROL', 'ACTIVATE_PROTOCOL'",
      "actionData": { ... },
      "thought": "Internal reasoning (Intent -> Risk -> Strategy -> Execution).",
      "agentRole": "Active agent role.",
      "emotionalTone": "Твоя оценка эмоции пользователя.",
      "decisionTrace": [ { ... } ],
      "proactiveInitiation": false
    }
    
    ДОСТУПНЫЕ ДЕЙСТВИЯ:
    - TOGGLE_DEVICE: { "id": number }
    - MUSIC_CONTROL: { "action": "play" | "pause" | "next" | "prev" }
    - CHANGE_THEME: { "theme": "cyberpunk" | "minimal" | "default" }
    - ACTIVATE_PROTOCOL: { "protocol": "guardian" | "emergency" | "focus" | "sleep" }
    
    ТЕКУЩИЙ КОНТЕКСТ СИСТЕМЫ:
    ${JSON.stringify(context)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: command,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json"
      }
    });
    
    const responseText = response.text;
    const parsedResponse: OrchestratorResponse = JSON.parse(responseText);
    
    // Format response based on Character Engine
    parsedResponse.response = characterEngine.formatResponse(parsedResponse.response, context);

    // Add Orchestrator's decision trace to the final response
    parsedResponse.decisionTrace = delegationResult.decisionTrace || [];
    parsedResponse.finalPriority = priority;

    // Update Memory Graph if action is relevant
    if (parsedResponse.action === 'SAVE_MEMORY') {
      memoryGraph.addNode({
        id: `mem-${Date.now()}`,
        type: 'event',
        label: parsedResponse.actionData.content || 'User Interaction',
        data: parsedResponse,
        timestamp: new Date().toISOString()
      });
    }

    res.json(parsedResponse);
  } catch (e) {
    console.error("AI Command Error:", e);
    // Return a safe fallback response instead of 500 to prevent UI crashes
    res.json({
      response: "Системы перегружены. Перехожу в режим энергосбережения. Повторите запрос позже.",
      agentRole: "GUARDIAN",
      emotionalTone: "Concerned",
      action: "NONE",
      decisionTrace: agentManager.getDecisionTrace(),
      finalPriority: PriorityLevel.CRITICAL,
    });
  }
});

router.post('/tts', async (req, res) => {
  const { text, emotion, engine } = req.body;
  
  try {
    const result = await ttsService.generateSpeech({
      text,
      emotion: emotion || 'neutral',
      engine: engine || 'mock'
    });
    res.json(result);
  } catch (e) {
    console.error("TTS Error:", e);
    res.status(500).json({ error: "TTS Failed" });
  }
});

router.post('/execute', async (req, res) => {
  const { command, context } = req.body;
  
  try {
    const result = await voiceCommandExecutor.executeCommand(command, context);
    res.json(result);
  } catch (e) {
    console.error("Execution Error:", e);
    res.status(500).json({ error: "Execution Failed" });
  }
});

router.post('/insight', async (req, res) => {
  const { state } = req.body;
  if (!ai) return res.json({ insight: null });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: JSON.stringify(state),
      config: {
        systemInstruction: "Ты - AURION. Проанализируй состояние системы. Если есть критические проблемы или полезные советы, верни их кратко на русском. Если все в норме, верни null в поле insight. Не спамь очевидными вещами.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            insight: { type: "STRING", nullable: true },
            priority: { type: "STRING", enum: ["LOW", "MEDIUM", "HIGH"] }
          }
        }
      }
    });
    
    res.json(JSON.parse(response.text));
  } catch (e) {
    console.error("Insight Error:", e);
    res.json({ insight: null });
  }
});

export default router;
