import express from 'express';
import './services/userStore.js'; // ensure users table is created before doodles
import routes from './routes/index.js';

const app = express();

app.use(express.json());
app.use('/', routes);
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

export default app;
