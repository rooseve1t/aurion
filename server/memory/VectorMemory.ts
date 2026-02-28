import { dbService } from '../services/DatabaseService';
import { llmService } from '../services/LLMService';
import { createLogger } from '../core/Logger';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('VectorMemory');

export interface VectorDocument {
  id: string;
  content: string;
  metadata: any;
  similarity?: number;
}

class VectorMemory {
  constructor() {
    logger.info('VectorMemory initialized');
  }

  async addDocument(content: string, metadata: any = {}): Promise<string> {
    try {
      const embedding = await llmService.getEmbeddings(content);
      const id = uuidv4();
      const timestamp = Date.now();

      dbService.getDb().prepare(`
        INSERT INTO memory_vectors (id, content, embedding, metadata, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, content, JSON.stringify(embedding), JSON.stringify(metadata), timestamp);

      logger.info(`Added document to vector memory: ${id}`);
      return id;
    } catch (e) {
      logger.error('Failed to add document to vector memory', e);
      throw e;
    }
  }

  async search(query: string, limit: number = 5): Promise<VectorDocument[]> {
    try {
      const queryEmbedding = await llmService.getEmbeddings(query);
      
      // Fetch all vectors (inefficient for large datasets, but fine for prototype)
      const rows = dbService.getDb().prepare(`
        SELECT id, content, embedding, metadata FROM memory_vectors
      `).all() as any[];

      const results = rows.map(row => {
        const embedding = JSON.parse(row.embedding);
        const similarity = this.cosineSimilarity(queryEmbedding, embedding);
        return {
          id: row.id,
          content: row.content,
          metadata: JSON.parse(row.metadata),
          similarity
        };
      });

      // Sort by similarity descending
      results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

      return results.slice(0, limit);
    } catch (e) {
      logger.error('Vector search failed', e);
      return [];
    }
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const vectorMemory = new VectorMemory();
