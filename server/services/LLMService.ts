import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { createLogger } from '../core/Logger';

const logger = createLogger('LLMService');

export type LLMTaskType = 'chat' | 'reasoning' | 'creative' | 'coding' | 'fast';

interface LLMOptions {
  temperature?: number;
  maxOutputTokens?: number;
  jsonMode?: boolean;
  systemInstruction?: string;
}

export class LLMService {
  private ai: GoogleGenAI;
  private models: Record<LLMTaskType, string>;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error('GEMINI_API_KEY is missing');
      throw new Error('GEMINI_API_KEY is required');
    }
    this.ai = new GoogleGenAI({ apiKey });

    // Map task types to specific models
    this.models = {
      chat: 'gemini-3-flash-preview',
      reasoning: 'gemini-3.1-pro-preview',
      creative: 'gemini-3.1-pro-preview',
      coding: 'gemini-3.1-pro-preview',
      fast: 'gemini-3-flash-preview', // Use flash for speed
    };
  }

  async generate(
    prompt: string,
    taskType: LLMTaskType = 'chat',
    options: LLMOptions = {}
  ): Promise<string> {
    const modelName = this.models[taskType];
    logger.info(`Generating content with model: ${modelName} for task: ${taskType}`);

    try {
      const config: any = {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens,
      };

      if (options.jsonMode) {
        config.responseMimeType = "application/json";
      }

      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction;
      }

      // For reasoning tasks, we might want to adjust thinking level if supported by the model
      // But for now, we'll stick to standard config

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config,
      });

      const text = response.text;
      if (!text) {
        throw new Error('No text generated');
      }

      return text;
    } catch (error) {
      logger.error('LLM generation failed', error);
      throw error;
    }
  }

  async generateStream(
    prompt: string,
    taskType: LLMTaskType = 'chat',
    options: LLMOptions = {}
  ): Promise<AsyncIterable<string>> {
    const modelName = this.models[taskType];
    
    // ... similar config setup ...
     const config: any = {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens,
      };

      if (options.jsonMode) {
        config.responseMimeType = "application/json";
      }
      
      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction;
      }

    try {
      const responseStream = await this.ai.models.generateContentStream({
        model: modelName,
        contents: prompt,
        config
      });

      // Generator function to yield chunks
      async function* streamGenerator() {
        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) yield text;
        }
      }

      return streamGenerator();
    } catch (error) {
      logger.error('LLM stream generation failed', error);
      throw error;
    }
  }

  async getEmbeddings(text: string): Promise<number[]> {
    try {
      const response = await this.ai.models.embedContent({
        model: "text-embedding-004",
        contents: { parts: [{ text }] }
      });
      
      if (response.embeddings && response.embeddings[0] && response.embeddings[0].values) {
        return response.embeddings[0].values;
      }
      throw new Error('No embedding returned');
    } catch (error) {
      logger.error('Embedding generation failed', error);
      throw error;
    }
  }
}

export const llmService = new LLMService();
