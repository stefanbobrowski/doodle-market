export interface AuditLogEntry {
  timestamp: string;
  event: string;
  userId?: number;
  username?: string;
  data: {
    title?: string;
    id?: number;
    views?: number;
    likes?: number;
    [key: string]: unknown;
  };
}
