import express from 'express';
import { authenticate, AuthRequest } from '../middleware/authenticate.js';
import { resetToSeed } from '../services/store.js';
import { resetBalance, getUserById } from '../services/userStore.js';
import db from '../services/db.js';

const router = express.Router();

const requireAdmin = (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
};

// POST /admin/reset - full seed reset
router.post('/reset', authenticate, requireAdmin, (req: AuthRequest, res) => {
  try {
    resetToSeed();

    // Reset all user balances
    const users = db.prepare('SELECT id, role FROM users').all() as {
      id: number;
      role: string;
    }[];
    for (const user of users) {
      const startingBalance = user.role === 'admin' ? 1000 : 100;
      resetBalance(user.id, startingBalance);
    }

    res.json({ message: 'Reset to seed complete' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /admin/reset-balance/:userId - reset one user's balance
router.post(
  '/reset-balance/:userId',
  authenticate,
  requireAdmin,
  (req, res) => {
    const user = getUserById(+req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const startingBalance = user.role === 'admin' ? 1000 : 100;
    const updated = resetBalance(+req.params.userId, startingBalance);
    res.json({ user: updated });
  }
);

export default router;
