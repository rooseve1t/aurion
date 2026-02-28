import { createLogger } from '../core/Logger';
import { z } from 'zod';

const logger = createLogger('SafetyLayer');

export class SafetyLayer {
  private static instance: SafetyLayer;

  private constructor() {}

  public static getInstance(): SafetyLayer {
    if (!SafetyLayer.instance) {
      SafetyLayer.instance = new SafetyLayer();
    }
    return SafetyLayer.instance;
  }

  // --- Input Validation ---
  public validateInput(schema: z.ZodSchema, data: any): { success: boolean; data?: any; error?: string } {
    try {
      const parsed = schema.parse(data);
      return { success: true, data: parsed };
    } catch (e) {
      logger.warn('Input Validation Failed:', e.errors);
      return { success: false, error: e.errors.map((err: any) => `${err.path}: ${err.message}`).join(', ') };
    }
  }

  // --- Output Sanitization ---
  public sanitizeOutput(data: any): any {
    // Basic sanitization (e.g., remove sensitive keys like 'password', 'token')
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      delete sanitized.password;
      delete sanitized.token;
      delete sanitized.apiKey;
      delete sanitized.secret;
      return sanitized;
    }
    return data;
  }

  // --- Rate Limiting (Simple Token Bucket) ---
  private requestCounts: Map<string, number> = new Map();
  private lastReset: number = Date.now();

  public checkRateLimit(ip: string, limit: number = 100): boolean {
    const now = Date.now();
    if (now - this.lastReset > 60000) { // Reset every minute
      this.requestCounts.clear();
      this.lastReset = now;
    }

    const count = (this.requestCounts.get(ip) || 0) + 1;
    this.requestCounts.set(ip, count);

    if (count > limit) {
      logger.warn(`Rate Limit Exceeded for IP: ${ip}`);
      return false;
    }
    return true;
  }
}

export const safetyLayer = SafetyLayer.getInstance();
