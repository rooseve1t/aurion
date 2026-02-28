import { createLogger } from '../core/Logger';
import { dbService } from '../services/DatabaseService';
import { v4 as uuidv4 } from 'uuid';
import { vectorMemory } from './VectorMemory';

const logger = createLogger('MemoryGraph');

export interface MemoryNode {
  id: string;
  type: 'event' | 'concept' | 'entity' | 'interaction';
  label: string;
  data: any;
  importance: number;
  decayFactor: number;
  timestamp: string;
}

export interface MemoryEdge {
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export class MemoryGraph {
  private nodes: Map<string, MemoryNode> = new Map();
  private edges: MemoryEdge[] = [];

  constructor() {
    this.init();
  }

  private init() {
    logger.info('Initializing Memory Graph from DB...');
    const db = dbService.getDb();
    
    // Load Nodes
    try {
      const rows = db.prepare('SELECT * FROM memories').all();
      rows.forEach((row: any) => {
        this.nodes.set(row.id, {
          id: row.id,
          type: row.type as any,
          label: row.content,
          data: JSON.parse(row.metadata || '{}'),
          importance: row.importance || 0.5,
          decayFactor: row.decay_factor || 0.99,
          timestamp: new Date(row.timestamp).toISOString()
        });
      });
      logger.info(`Loaded ${this.nodes.size} memory nodes.`);
    } catch (e) {
      logger.error('Failed to load memory nodes', e);
    }
  }

  public async addNode(node: Partial<MemoryNode>) {
    const newNode: MemoryNode = {
      id: node.id || uuidv4(),
      type: node.type || 'event',
      label: node.label || 'Unknown',
      data: node.data || {},
      importance: node.importance || 1.0,
      decayFactor: node.decayFactor || 0.95, // Default decay
      timestamp: node.timestamp || new Date().toISOString()
    };

    this.nodes.set(newNode.id, newNode);
    
    // Persist to DB (Relational)
    try {
      const stmt = dbService.getDb().prepare(`
        INSERT OR REPLACE INTO memories (id, type, content, metadata, importance, decay_factor, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        newNode.id, 
        newNode.type, 
        newNode.label, 
        JSON.stringify(newNode.data), 
        newNode.importance, 
        newNode.decayFactor, 
        new Date(newNode.timestamp).getTime()
      );

      // Persist to Vector Memory (Semantic)
      // We do this asynchronously to not block
      vectorMemory.addDocument(newNode.label, { ...newNode.data, type: newNode.type, originalId: newNode.id })
        .catch(err => logger.error('Failed to add to vector memory', err));

    } catch (e) {
      logger.error('Failed to persist memory node', e);
    }

    return newNode;
  }

  public decay() {
    // ... (existing decay logic) ...
    logger.debug('Applying memory decay...');
    
    this.nodes.forEach((node, id) => {
      // Simple exponential decay
      node.importance *= node.decayFactor;
      
      // Prune low importance memories
      if (node.importance < 0.1) {
        this.nodes.delete(id);
        dbService.getDb().prepare('DELETE FROM memories WHERE id = ?').run(id);
        logger.debug(`Pruned memory: ${node.label} [ID: ${id}]`);
      } else {
        // Update DB
        dbService.getDb().prepare('UPDATE memories SET importance = ? WHERE id = ?').run(node.importance, id);
      }
    });
  }

  public async search(query: string, limit: number = 5): Promise<MemoryNode[]> {
    // Hybrid Search: Keyword + Vector
    
    // 1. Vector Search (Semantic)
    const vectorResults = await vectorMemory.search(query, limit);
    const vectorIds = new Set(vectorResults.map(r => r.metadata.originalId));
    
    // 2. Keyword Search (Exact Match)
    const keywordResults = Array.from(this.nodes.values())
      .filter(node => node.label.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);

    // 3. Merge Results
    const merged = new Map<string, MemoryNode>();
    
    // Add vector results first (usually higher quality for "meaning")
    vectorResults.forEach(r => {
      const node = this.nodes.get(r.metadata.originalId);
      if (node) merged.set(node.id, node);
    });

    // Add keyword results
    keywordResults.forEach(node => {
      if (!merged.has(node.id)) merged.set(node.id, node);
    });

    return Array.from(merged.values()).slice(0, limit);
  }

  public getGraph() {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges
    };
  }
}

export const memoryGraph = new MemoryGraph();
