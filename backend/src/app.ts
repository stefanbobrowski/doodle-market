import express from 'express';
import path from 'path';
import './services/userStore.js';
import routes from './routes/index.js';

const app = express();

app.use(express.json());
app.use('/api', routes);
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

// Serve frontend static files in production
const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir));

// SPA fallback - let React Router handle all non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

export default app;
