import express from 'express';
import doodlesRouter from './doodles.js';
import interactionsRouter from './interactions.js';

const router = express.Router();

// Root routes
router.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1><p>Welcome to the Doodle Market API</p>');
});

router.post('/', (req, res) => {
  res.send('<h1>Got a POST request</h1>');
});

// Doodle routes
router.use('/doodles', doodlesRouter);

router.use('/doodles', interactionsRouter);

export default router;
