import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'logs', 'audit.json');

interface LogUser {
  id?: number;
  username?: string;
}

export const logEvent = (event: string, data: any, user?: LogUser) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    userId: user?.id,
    username: user?.username || 'Anonymous',
    data,
  };
  const logs = fs.existsSync(logFile)
    ? JSON.parse(fs.readFileSync(logFile, 'utf-8'))
    : [];
  logs.push(logEntry);
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
};
