import express from 'express';
import { incrementViews, incrementLikes } from '../services/store.js';

const router = express.Router();

router.post('/:id/view', (req, res) => {
  const updated = incrementViews(+req.params.id);
  if (!updated) return res.status(404).send('Doodle not found');
  res.json({ views: updated.views });
});

router.post('/:id/like', (req, res) => {
  const updated = incrementLikes(+req.params.id);
  if (!updated) return res.status(404).send('Doodle not found');
  res.json({ likes: updated.likes });
});

export default router;
