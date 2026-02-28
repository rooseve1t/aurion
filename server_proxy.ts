import express from "express";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

async def startServer() {
  const app = express();
  const PORT = 3000;
  const PYTHON_PORT = 3001;

  console.log("Starting AURION OS Proxy Server...");

  // Proxy API requests to Python backend
  app.use("/api", createProxyMiddleware({
    target: `http://localhost:${PYTHON_PORT}`,
    changeOrigin: true,
  }));

  // Proxy WebSocket requests to Python backend
  app.use("/ws", createProxyMiddleware({
    target: `http://localhost:${PYTHON_PORT}`,
    ws: true,
    changeOrigin: true,
  }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false 
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files (though Python could also do this)
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AURION OS Proxy running on http://localhost:${PORT}`);
    console.log(`Routing /api and /ws to Python backend on port ${PYTHON_PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start proxy server:", err);
});
