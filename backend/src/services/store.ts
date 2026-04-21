import fs from 'fs';
import path from 'path';
import { Doodle } from '../types/doodle.js';
import { logEvent } from './logger.js';

// Load seed data into an in-memory store
const store: Doodle[] = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/data', 'seed.json'), 'utf-8')
);

export const getAllDoodles = (): Doodle[] => store;

export const getDoodleById = (id: number): Doodle | undefined =>
  store.find((doodle) => doodle.id === id);

export const addDoodle = (
  newDoodleData: Omit<Doodle, 'id' | 'views' | 'likes'>
): Doodle => {
  if (
    !newDoodleData.title ||
    typeof newDoodleData.title !== 'string' ||
    newDoodleData.title.trim() === ''
  ) {
    throw new Error('Title is required and cannot be empty');
  }

  if (typeof newDoodleData.price !== 'number' || newDoodleData.price <= 0) {
    throw new Error('Price must be a positive number');
  }

  if (!newDoodleData.imagePath || typeof newDoodleData.imagePath !== 'string') {
    throw new Error('Image path is required');
  }

  const newDoodle = {
    id: store.length + 1, // Simple ID generation
    views: 0,
    likes: 0,
    ...newDoodleData,
  };
  store.push(newDoodle);
  logEvent('Doodle Added', newDoodle);
  return newDoodle;
};

export const updateDoodle = (
  id: number,
  updateData: Partial<Omit<Doodle, 'id' | 'views' | 'likes'>>
): Doodle | null => {
  const doodle = getDoodleById(id);
  if (!doodle) return null;
  logEvent('Doodle Updated', updateData);
  Object.assign(doodle, updateData);
  return doodle;
};

export const deleteDoodle = (id: number): boolean => {
  const index = store.findIndex((doodle) => doodle.id === id);
  if (index === -1) return false;
  const deletedDoodle = store[index];
  store.splice(index, 1);
  logEvent('Doodle Deleted', deletedDoodle);
  return true;
};

export const incrementViews = (id: number): Doodle | null => {
  const doodle = getDoodleById(id);
  if (!doodle) return null;
  doodle.views += 1;
  logEvent('Doodle Viewed', {
    id: doodle.id,
    title: doodle.title,
    views: doodle.views,
  });
  return doodle;
};

export const incrementLikes = (id: number): Doodle | null => {
  const doodle = getDoodleById(id);
  if (!doodle) return null;
  doodle.likes += 1;
  logEvent('Doodle Liked', {
    id: doodle.id,
    title: doodle.title,
    likes: doodle.likes,
  });
  return doodle;
};
