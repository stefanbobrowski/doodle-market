import bcrypt from 'bcryptjs';
import db from './db.js';
import type { User, PublicUser } from '../types/user.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    balance REAL NOT NULL DEFAULT 100.00
  )
`);

const seedUsers = () => {
  const count = (
    db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
  ).count;
  if (count > 0) return;

  const users = [
    { username: 'admin', password: 'admin123', role: 'admin', balance: 1000 },
    { username: 'pixel_pete', password: 'pete123', role: 'user', balance: 100 },
    { username: 'sketch_sam', password: 'sam123', role: 'user', balance: 100 },
  ];

  const insert = db.prepare(
    'INSERT INTO users (username, passwordHash, role, balance) VALUES (@username, @passwordHash, @role, @balance)'
  );

  for (const u of users) {
    const passwordHash = bcrypt.hashSync(u.password, 10);
    insert.run({
      username: u.username,
      passwordHash,
      role: u.role,
      balance: u.balance,
    });
  }
};

seedUsers();

export const getUserByUsername = (username: string): User | undefined =>
  db.prepare('SELECT * FROM users WHERE username = ?').get(username) as
    | User
    | undefined;

export const getUserById = (id: number): PublicUser | undefined =>
  db
    .prepare('SELECT id, username, role, balance FROM users WHERE id = ?')
    .get(id) as PublicUser | undefined;
