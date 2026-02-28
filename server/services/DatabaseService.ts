import Database from 'better-sqlite3';
import { createLogger } from '../core/Logger';
import path from 'path';
import fs from 'fs';

const logger = createLogger('DatabaseService');

export class DatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(process.cwd(), 'aurion.db');
    this.db = new Database(dbPath);
    this.init();
  }

  private init() {
    logger.info('Initializing Database...');
    
    // Enable WAL mode for better concurrency
    this.db.pragma('journal_mode = WAL');

    // Create Tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload TEXT,
        priority TEXT,
        source TEXT,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        type TEXT,
        content TEXT,
        metadata TEXT,
        importance REAL DEFAULT 0,
        decay_factor REAL DEFAULT 1.0,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS knowledge_graph (
        id TEXT PRIMARY KEY,
        subject TEXT,
        predicate TEXT,
        object TEXT,
        metadata TEXT,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS system_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cpu_usage REAL,
        ram_usage REAL,
        timestamp INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS agent_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id TEXT,
        action TEXT,
        result TEXT,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS memory_vectors (
        id TEXT PRIMARY KEY,
        content TEXT,
        embedding TEXT,
        metadata TEXT,
        timestamp INTEGER
      );
    `);
    
    logger.info('Database initialized successfully.');
  }

  public getDb() {
    return this.db;
  }

  public close() {
    this.db.close();
    logger.info('Database connection closed.');
  }
}

export const dbService = new DatabaseService();
