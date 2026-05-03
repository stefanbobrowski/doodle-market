import express from 'express';
import { getDoodleById } from '../services/store.js';
import { deductBalance, getUserById } from '../services/userStore.js';
import { sendPurchaseConfirmation } from '../services/emailService.js';
import { authenticate, AuthRequest } from '../middleware/authenticate.js';
import { logEvent } from '../services/logger.js';

const router = express.Router();

// POST /doodles/:id/purchase
router.post('/:id/purchase', authenticate, async (req: AuthRequest, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  const doodle = getDoodleById(+req.params.id);
  if (!doodle) return res.status(404).json({ error: 'Doodle not found' });

  const userId = req.user!.id;

  if (doodle.userId === userId) {
    return res.status(400).json({ error: "You can't buy your own doodle" });
  }

  const updatedUser = deductBalance(userId, doodle.price);
  if (!updatedUser) {
    const buyer = getUserById(userId);
    const balance = buyer?.balance ?? 0;
    return res.status(402).json({
      error: `Insufficient balance. You have $${balance.toFixed(2)} but this doodle costs $${doodle.price.toFixed(2)}.`,
    });
  }

  logEvent(
    'Doodle Purchased',
    {
      doodleId: doodle.id,
      title: doodle.title,
      price: doodle.price,
      buyerId: userId,
      buyerUsername: req.user!.username,
      email,
    },
    { id: userId, username: req.user!.username }
  );

  // Don't fail the purchase if email errors
  sendPurchaseConfirmation({
    to: email,
    buyerUsername: req.user!.username,
    doodleTitle: doodle.title,
    price: doodle.price,
    remainingBalance: updatedUser.balance,
  }).catch((err) => console.error('Email send failed:', err));

  res.json({
    message: 'Purchase successful',
    doodle: { id: doodle.id, title: doodle.title, price: doodle.price },
    user: updatedUser,
  });
});

export default router;
