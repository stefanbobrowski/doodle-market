import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH =
  process.env.NODE_ENV === 'test'
    ? ':memory:'
    : path.join(process.cwd(), 'data', 'doodles.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

export default db;
