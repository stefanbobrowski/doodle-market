import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const logFile = path.join(process.cwd(), 'logs', 'audit.json');

router.get('/audit-log', (req, res) => {
  try {
    if (!fs.existsSync(logFile)) return res.json([]);
    const logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    const limit = parseInt(req.query.limit as string) || 100;
    res.json(logs.slice(-limit).reverse());
  } catch (err) {
    res.status(500).json({ error: 'Failed to read audit log' });
  }
});

export default router;
