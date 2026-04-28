import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {
  getAllDoodles,
  getDoodleById,
  addDoodle,
  updateDoodle,
  deleteDoodle,
} from '../services/store.js';
import { Doodle } from '../types/doodle.js';
import { authenticate, AuthRequest } from '../middleware/authenticate.js';

const router = express.Router();

const upload = multer({
  dest: path.join(process.cwd(), 'uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Get all doodles
router.get('/', (req, res) => {
  res.json(getAllDoodles());
});

// Get a single doodle by ID
router.get('/:id', (req, res) => {
  const doodle = getDoodleById(+req.params.id);
  if (!doodle) return res.status(404).send('Doodle not found');
  res.json(doodle);
});

// Add a new doodle
router.post(
  '/',
  authenticate,
  upload.single('imagePath'),
  (req: AuthRequest, res) => {
    try {
      const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

      const newDoodle = addDoodle({
        ...req.body,
        imagePath,
        price: parseFloat(req.body.price),
        userId: req.user!.id,
      });
      res.status(201).json(newDoodle);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

// Update a doodle
router.patch(
  '/:id',
  authenticate,
  upload.single('imagePath'),
  (req: AuthRequest, res) => {
    const doodle = getDoodleById(+req.params.id);
    if (!doodle) return res.status(404).send('Doodle not found');

    const { id: userId, role } = req.user!;
    if (doodle.userId !== userId && role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'You can only edit your own doodles' });
    }

    // If a new file is uploaded, update the imagePath
    const updateData: Partial<Omit<Doodle, 'id'>> = { ...req.body };
    if (req.file) {
      updateData.imagePath = `/uploads/${req.file.filename}`;
      // Delete the old file
      const oldPath = path.join(process.cwd(), doodle.imagePath);
      fs.unlink(oldPath, (err) => {
        if (err) console.error('Failed to delete old image:', err);
      });
    }

    // Parse price if provided
    if (req.body.price) {
      updateData.price = parseFloat(req.body.price);
    }
    const updatedDoodle = updateDoodle(+req.params.id, updateData);
    if (!updatedDoodle) return res.status(404).send('Doodle not found');
    res.json(updatedDoodle);
  }
);

// Delete a doodle
router.delete('/:id', authenticate, (req: AuthRequest, res) => {
  const doodle = getDoodleById(+req.params.id);
  if (!doodle) return res.status(404).send('Doodle not found');

  const { id: userId, role } = req.user!;
  if (doodle.userId !== userId && role !== 'admin') {
    return res
      .status(403)
      .json({ error: 'You can only delete your own doodles' });
  }

  // Delete the image file if it exists
  if (doodle.imagePath) {
    const imagePath = path.join(process.cwd(), doodle.imagePath);
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Failed to delete image:', err);
    });
  }

  const deleted = deleteDoodle(+req.params.id);
  if (!deleted) return res.status(404).send('Doodle not found');
  res.status(204).send();
});

export default router;
