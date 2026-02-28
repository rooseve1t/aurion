import express from 'express';
import { db } from '../db';
import { safetyLayer } from '../core/SafetyLayer';
import { z } from 'zod';

const router = express.Router();

// Schemas
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

const updateSchema = z.object({
  id: z.number(),
  username: z.string().optional(),
  password: z.string().optional(),
  newPassword: z.string().optional()
});

// --- Routes ---

router.post('/login', (req, res) => {
  const validation = safetyLayer.validateInput(loginSchema, req.body);
  if (!validation.success) return res.status(400).json({ error: validation.error });

  const { username, password } = validation.data;
  const user = db.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ token: "mock-jwt-token-123", user: userWithoutPassword });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.get('/me', (req, res) => {
  // In a real app, verify token from headers
  const user = db.users[0];
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.post('/update', (req, res) => {
  const validation = safetyLayer.validateInput(updateSchema, req.body);
  if (!validation.success) return res.status(400).json({ error: validation.error });

  const { id, username, password, newPassword, ...updates } = validation.data;
  const userIndex = db.users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    // If password change requested
    if (newPassword) {
      if (db.users[userIndex].password !== password) {
        return res.status(401).json({ error: "Invalid current password" });
      }
      db.users[userIndex].password = newPassword;
    }

    // Update other fields
    db.users[userIndex] = { ...db.users[userIndex], ...updates, username };
    
    const { password: _, ...userWithoutPassword } = db.users[userIndex];
    res.json({ user: userWithoutPassword });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

export default router;
