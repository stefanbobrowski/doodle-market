import path from 'path';
import fs from 'fs';
import { Doodle } from '../types/doodle.js';
import { logEvent } from './logger.js';
import db from './db.js';

// Create table and seed if empty
db.exec(`
  CREATE TABLE IF NOT EXISTS doodles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    imagePath TEXT NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    userId INTEGER REFERENCES users(id)
  )
`);

// Add userId column to existing databases that predate this migration
try {
  db.exec('ALTER TABLE doodles ADD COLUMN userId INTEGER REFERENCES users(id)');
} catch {
  // Column already exists, nothing to do
}

const seedIfEmpty = () => {
  const count = (
    db.prepare('SELECT COUNT(*) as count FROM doodles').get() as {
      count: number;
    }
  ).count;
  if (count > 0) return;

  const seedPath = path.join(process.cwd(), 'data/seed.json');
  const seed: Doodle[] = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  const insert = db.prepare(
    'INSERT INTO doodles (id, title, description, price, imagePath, views, likes, userId) VALUES (@id, @title, @description, @price, @imagePath, @views, @likes, @userId)'
  );
  const insertMany = db.transaction((doodles: Doodle[]) => {
    for (const doodle of doodles) insert.run(doodle);
  });
  insertMany(seed);
};

seedIfEmpty();

export const getAllDoodles = (): Doodle[] =>
  db.prepare('SELECT * FROM doodles').all() as Doodle[];

export const getDoodleById = (id: number): Doodle | undefined =>
  db.prepare('SELECT * FROM doodles WHERE id = ?').get(id) as
    | Doodle
    | undefined;

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

  const result = db
    .prepare(
      'INSERT INTO doodles (title, description, price, imagePath, views, likes, userId) VALUES (@title, @description, @price, @imagePath, 0, 0, @userId)'
    )
    .run(newDoodleData);

  const newDoodle = getDoodleById(result.lastInsertRowid as number)!;
  logEvent('Doodle Added', newDoodle);
  return newDoodle;
};

export const updateDoodle = (
  id: number,
  updateData: Partial<Omit<Doodle, 'id' | 'views' | 'likes'>>
): Doodle | null => {
  const doodle = getDoodleById(id);
  if (!doodle) return null;

  const fields = Object.keys(updateData)
    .map((k) => `${k} = @${k}`)
    .join(', ');
  db.prepare(`UPDATE doodles SET ${fields} WHERE id = @id`).run({
    ...updateData,
    id,
  });
  logEvent('Doodle Updated', updateData);
  return getDoodleById(id)!;
};

export const deleteDoodle = (id: number): boolean => {
  const doodle = getDoodleById(id);
  if (!doodle) return false;
  db.prepare('DELETE FROM doodles WHERE id = ?').run(id);
  logEvent('Doodle Deleted', doodle);
  return true;
};

export const incrementViews = (id: number): Doodle | null => {
  const result = db
    .prepare('UPDATE doodles SET views = views + 1 WHERE id = ?')
    .run(id);
  if (result.changes === 0) return null;
  const doodle = getDoodleById(id)!;
  logEvent('Doodle Viewed', {
    id: doodle.id,
    title: doodle.title,
    views: doodle.views,
  });
  return doodle;
};

export const incrementLikes = (id: number): Doodle | null => {
  const result = db
    .prepare('UPDATE doodles SET likes = likes + 1 WHERE id = ?')
    .run(id);
  if (result.changes === 0) return null;
  const doodle = getDoodleById(id)!;
  logEvent('Doodle Liked', {
    id: doodle.id,
    title: doodle.title,
    likes: doodle.likes,
  });
  return doodle;
};

export const resetToSeed = (): void => {
  const seedPath = path.join(process.cwd(), 'data/seed.json');
  const seed: Doodle[] = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  const seedIds = new Set(seed.map((d) => d.id));
  const seedImagePaths = new Set(seed.map((d) => d.imagePath));

  // Delete uploaded image files for non-seed doodles
  const allDoodles = getAllDoodles();
  for (const doodle of allDoodles) {
    if (!seedIds.has(doodle.id) || !seedImagePaths.has(doodle.imagePath)) {
      if (doodle.imagePath && !seedImagePaths.has(doodle.imagePath)) {
        const filePath = path.join(process.cwd(), doodle.imagePath);
        try {
          fs.unlinkSync(filePath);
        } catch {
          /* already gone */
        }
      }
    }
  }

  // Reset doodles table to seed state
  const reset = db.transaction(() => {
    db.prepare('DELETE FROM doodles').run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'doodles'").run();
    const insert = db.prepare(
      'INSERT INTO doodles (id, title, description, price, imagePath, views, likes, userId) VALUES (@id, @title, @description, @price, @imagePath, @views, @likes, @userId)'
    );
    for (const doodle of seed) insert.run(doodle);
  });
  reset();

  logEvent('Admin Reset', { action: 'reset to seed' });
};
