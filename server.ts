import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';

// Core Engines
import { dbService } from "./server/services/DatabaseService";
import { cognitiveEngine } from "./server/core/CognitiveEngine";
import { systemAwareness } from "./server/core/SystemAwareness";
import { orchestrator } from "./server/core/Orchestrator";
import { autonomousInitiative } from "./server/core/AutonomousInitiative";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting AURION OS initialization...");

// --- Start Python Core ---
function startPythonCore() {
  console.log("🚀 Starting Python Core...");
  const pythonProcess = spawn('python3', ['-m', 'uvicorn', 'app.main:app', '--port', '8000'], {
    cwd: path.join(process.cwd(), 'python_core'),
    env: { ...process.env, PYTHONPATH: '.' }
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`[Python Core]: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Python Core Error]: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`[Python Core] exited with code ${code}`);
  });

  return pythonProcess;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Start Python Core
  const pythonCore = startPythonCore();

  // --- Proxy to Python Core (AI OS 1.0) ---
  app.use('/api/ai/command', createProxyMiddleware({
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    pathRewrite: {
      '^/api/ai/command': '/api/voice/command',
    },
    onError: (err, req, res) => {
      console.error('Proxy Error (Python Core):', err);
      res.status(502).json({ 
        response: "Системы ИИ (Python Core) временно недоступны. Проверьте запуск демона.",
        agentRole: "GUARDIAN"
      });
    }
  }));

  app.use('/api/ai/insight', createProxyMiddleware({
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    pathRewrite: {
      '^/api/ai/insight': '/api/insight',
    },
    onError: (err, req, res) => {
      res.status(502).json({ insight: null });
    }
  }));

  app.use('/api/chat', createProxyMiddleware({
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('Proxy Error (Python Core Chat):', err);
      res.status(502).json({ 
        reply: "Сэр, канал связи с когнитивным ядром прерван.",
        conversation_id: "error"
      });
    }
  }));

  // --- Initialize Core Systems ---
  try {
    // Database is auto-initialized on import
    cognitiveEngine.start();
    orchestrator.start();
    // systemAwareness is auto-initialized on import
    // autonomousInitiative is auto-initialized on import (listeners attached)
    
    console.log("✅ Core Systems Active");
  } catch (e) {
    console.error("❌ Core System Failure:", e);
    process.exit(1);
  }

  // --- Routes ---
  app.use("/api/auth", authRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/system", systemRoutes); // Mounts /status, /memory, etc. at /api/system/...

  // --- Vite Middleware (Dev) / Static (Prod) ---
  if (process.env.NODE_ENV !== "production") {
    try {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: false // Disable HMR to prevent WebSocket errors in AI Studio
        },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Failed to start Vite server:", e);
    }
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AURION OS running on http://localhost:${PORT}`);
    console.log(`System State: ONLINE`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down AURION OS...');
  cognitiveEngine.stop();
  orchestrator.stop();
  dbService.close();
  process.exit(0);
});

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
