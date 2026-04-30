import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/doodles', () => {
  it('returns an array of doodles', async () => {
    const res = await request(app).get('/api/doodles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('each doodle has expected fields', async () => {
    const res = await request(app).get('/api/doodles');
    const doodle = res.body[0];
    expect(doodle).toHaveProperty('id');
    expect(doodle).toHaveProperty('title');
    expect(doodle).toHaveProperty('price');
    expect(doodle).toHaveProperty('imagePath');
  });
});

describe('GET /api/doodles/:id', () => {
  it('returns a single doodle', async () => {
    const res = await request(app).get('/api/doodles/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('returns 404 for nonexistent id', async () => {
    const res = await request(app).get('/api/doodles/99999');
    expect(res.status).toBe(404);
  });
});
