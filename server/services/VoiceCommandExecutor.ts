import { createLogger } from './Logger';
import { ttsService } from './TTSService';
import { llmService } from './LLMService';
import { agents } from '../agents';
import { eventBus } from '../core/EventBus';

const logger = createLogger('VoiceCommandExecutor');

export type CommandType = 'general_question' | 'task' | 'control' | 'automation';

class VoiceCommandExecutor {
  constructor() {
    logger.info('VoiceCommandExecutor initialized');
  }

  async executeCommand(text: string, context: any = {}): Promise<any> {
    logger.info(`Executing voice command: "${text}"`);

    // 1. Analyze intent using LLM (Brain Core)
    const intent = await this.analyzeIntent(text);
    logger.info(intent, `Detected intent: ${intent.type}`);

    let responseText = '';
    let actionResult = null;

    try {
      switch (intent.type) {
        case 'general_question':
          // Brain Core: General QA
          responseText = await llmService.generate(text, 'chat', {
            systemInstruction: "Ты — J.A.R.V.I.S., полезный и остроумный ИИ-ассистент. Отвечай кратко и в разговорном стиле."
          });
          break;

        case 'task':
          // Agent Core: Delegate to Orchestrator
          actionResult = await agents.orchestrator.execute(text, context);
          responseText = actionResult.refinedCommand 
            ? `Я передал эту задачу агенту ${actionResult.targetAgent}.` 
            : "Выполняю.";
          break;

        case 'control':
          // Control Core: Execute directly via ExecutionAgent
          // We can use the orchestrator for this too, but for speed we might go direct if simple
          // For now, let's use the orchestrator to keep it uniform, or direct to execution agent
          // Let's use the execution agent directly for simple controls
          actionResult = await agents.execution.execute(text, context);
          responseText = actionResult.message || "Готово.";
          break;

        default:
          responseText = "Я пока не уверен, как с этим справиться.";
      }

      // 2. Generate Voice Response (Voice Core)
      // Determine emotion based on text or context (simple heuristic for now)
      const emotion = responseText.includes('!') ? 'happy' : 'neutral';
      
      const ttsResponse = await ttsService.generateSpeech({
        text: responseText,
        engine: 'mock', // Use 'mock' for now, switch to 'cosyvoice2' when available
        emotion: emotion,
        language: 'ru'
      });

      return {
        text: responseText,
        audioUrl: ttsResponse.audioUrl,
        actionResult
      };

    } catch (error) {
      logger.error(error, 'Command execution failed');
      return {
        text: "Произошла ошибка при обработке вашего запроса.",
        error: 'Execution failed'
      };
    }
  }

  private async analyzeIntent(text: string): Promise<{ type: CommandType; confidence: number }> {
    // Use LLM to classify intent
    // Simple heuristic fallback for speed if needed, but let's use LLM
    try {
      const prompt = `Classify the following user command into one of these categories: 
      - general_question (informational, chat)
      - task (complex multi-step, planning, research)
      - control (device control, computer control, simple actions)
      
      Command: "${text}"
      
      Return JSON: { "type": "category", "confidence": 0.9 }`;

      const response = await llmService.generate(prompt, 'fast', {
        jsonMode: true,
        temperature: 0.1
      });
      
      return JSON.parse(response);
    } catch (e) {
      logger.error(e, 'Intent analysis failed');
      return { type: 'general_question', confidence: 0.5 }; // Fallback
    }
  }
}

export const voiceCommandExecutor = new VoiceCommandExecutor();
