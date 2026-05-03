import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { AuditLogEntry } from '../types/auditLog';

interface AuditLogContextType {
  logs: AuditLogEntry[];
  refreshAuditLog: () => void;
}

const AuditLogContext = createContext<AuditLogContextType | null>(null);

export const AuditLogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  const refreshAuditLog = () => {
    fetch('/api/audit-log')
      .then((r) => r.json())
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    refreshAuditLog();
  }, []);

  return (
    <AuditLogContext.Provider value={{ logs, refreshAuditLog }}>
      {children}
    </AuditLogContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuditLog = () => {
  const ctx = useContext(AuditLogContext);
  if (!ctx) throw new Error('useAuditLog must be used within AuditLogProvider');
  return ctx;
};
