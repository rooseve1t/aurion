import sqlite3
import json
import logging
from typing import List, Dict, Any

logger = logging.getLogger("MemoryGraph")

class MemoryGraph:
    def __init__(self, db_path="aurion_memory.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create Nodes table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS nodes (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                label TEXT NOT NULL,
                data TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create Edges table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS edges (
                source TEXT,
                target TEXT,
                relationship TEXT,
                weight REAL DEFAULT 1.0,
                FOREIGN KEY(source) REFERENCES nodes(id),
                FOREIGN KEY(target) REFERENCES nodes(id)
            )
        ''')
        
        # In a real implementation, we would load sqlite-vec extension here
        # conn.enable_load_extension(True)
        # conn.load_extension("vec0")
        
        conn.commit()
        conn.close()
        logger.info("База данных SQLite для графа памяти инициализирована.")

    def add_node(self, node_id: str, node_type: str, label: str, data: Dict[str, Any] = None):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO nodes (id, type, label, data) VALUES (?, ?, ?, ?)",
                (node_id, node_type, label, json.dumps(data) if data else "{}")
            )
            conn.commit()
            logger.info(f"Добавлен узел {node_id} ({node_type})")
        except sqlite3.IntegrityError:
            logger.warning(f"Узел {node_id} уже существует.")
        finally:
            conn.close()

    def get_recent_memories(self, limit=50):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, type, label, data, timestamp FROM nodes ORDER BY timestamp DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [{"id": r[0], "type": r[1], "label": r[2], "data": json.loads(r[3]), "timestamp": r[4]} for r in rows]
