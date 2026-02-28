import express from 'express';
import { db } from '../db';
import { agentManager } from '../agents/AgentManager';
import { memoryGraph } from '../memory/MemoryGraph';
import Parser from 'rss-parser';

const router = express.Router();
const parser = new Parser();

// --- Status ---
router.get('/status', (req, res) => {
  res.json({ 
    status: "online", 
    engine: "JarVoice 3.0 Enterprise", 
    core: "Active", 
    uptime: process.uptime(),
    metrics: db.systemMetrics,
    agents: agentManager.getSystemStatus()
  });
});

// --- Memory ---
router.get('/memory', (req, res) => {
  // Use DB service instead of in-memory array if possible, but for now fallback to db.memories for legacy compat
  res.json(db.memories.slice(-50).reverse());
});

router.post('/memory', async (req, res) => {
  const { type, content, metadata } = req.body;
  
  // Use new MemoryGraph
  const newNode = await memoryGraph.addNode({
    type,
    label: content,
    data: metadata
  });

  // Also push to legacy array for UI compatibility if needed
  const newMemory = {
    id: db.memories.length + 1,
    type,
    content,
    metadata,
    timestamp: new Date().toISOString()
  };
  db.memories.push(newMemory);

  res.json({ id: newNode.id });
});

// --- Knowledge Graph ---
router.get('/knowledge', (req, res) => {
  res.json(db.knowledge);
});

router.get('/graph', (req, res) => {
  res.json(memoryGraph.getGraph());
});

router.post('/knowledge', (req, res) => {
  const { subject, predicate, object, metadata } = req.body;
  const newKnowledge = {
    id: db.knowledge.length + 1,
    subject,
    predicate,
    object,
    metadata
  };
  db.knowledge.push(newKnowledge);
  res.json({ id: newKnowledge.id });
});

// --- Devices ---
router.get('/home/devices', (req, res) => {
  res.json(db.devices);
});

router.post('/home/devices/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id);
  const device = db.devices.find(d => d.id === id);
  if (device) {
    if (device.type === "wearable" || device.type === "audio") {
      device.status = device.status === "connected" ? "disconnected" : "connected";
    } else if (device.type === "speaker") {
      device.status = device.status === "active" || device.status === "playing" ? "idle" : "active";
    } else {
      device.status = device.status === "on" || device.status === "active" || device.status === "locked" || device.status === "closed" 
        ? (device.type === "security" ? "unlocked" : device.type === "cover" ? "open" : "off") 
        : (device.type === "security" ? "locked" : device.type === "cover" ? "closed" : "on");
    }
    res.json(device);
  } else {
    res.status(404).json({ error: "Device not found" });
  }
});

// --- Health ---
router.get('/health/stats', (req, res) => {
  res.json(db.health);
});

router.get('/health/twin', (req, res) => {
  res.json(db.digitalTwin);
});

router.post('/health/update', (req, res) => {
  db.health = { ...db.health, ...req.body, lastUpdated: new Date().toISOString() };
  res.json(db.health);
});

// --- Finance ---
router.get('/finance/status', (req, res) => {
  res.json(db.finance);
});

// --- Music ---
router.get('/music/current', (req, res) => {
  res.json(db.music);
});

router.post('/music/control', (req, res) => {
  const { action } = req.body; // play, pause, next, prev
  if (action === "play") db.music.playing = true;
  if (action === "pause") db.music.playing = false;
  if (action === "next") {
      db.music.track = "Next Track " + Math.floor(Math.random() * 100);
      db.music.progress = 0;
  }
  res.json(db.music);
});

// --- External Integrations (News/Weather) ---
router.get('/news/latest', async (req, res) => {
  try {
    const feed = await parser.parseURL('https://habr.com/ru/rss/best/daily/?fl=ru');
    const news = feed.items.slice(0, 5).map((item, index) => ({
      id: index,
      title: item.title,
      category: "IT / Технологии",
      link: item.link,
      pubDate: item.pubDate
    }));
    res.json(news);
  } catch (e) {
    console.error("News fetch error:", e);
    res.json([
      { id: 1, title: "Система: Оффлайн режим - RSS недоступен", category: "Система" }
    ]);
  }
});

router.get('/weather', async (req, res) => {
  try {
    const lat = 37.7749;
    const lon = -122.4194;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    res.json(data.current_weather);
  } catch (e) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

router.post('/translate', async (req, res) => {
  // Placeholder for translation service if needed, or move to AI routes
  res.json({ translatedText: "Translation service moved to AI module." });
});

export default router;
