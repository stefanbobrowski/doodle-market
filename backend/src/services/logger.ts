import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'logs', 'audit.json');

export const logEvent = (event: string, data: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    data,
  };
  // Append to file (create if doesn't exist)
  const logs = fs.existsSync(logFile)
    ? JSON.parse(fs.readFileSync(logFile, 'utf-8'))
    : [];
  logs.push(logEntry);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
};
