import { useState } from 'react';
import Divider from './Divider';
import { useAuditLog } from '../context/AuditLogContext';

const eventClass = (event: string) => {
  if (event.includes('Purchased')) return 'event-purchase';
  if (event.includes('Added')) return 'event-added';
  if (event.includes('Deleted')) return 'event-deleted';
  if (event.includes('Updated')) return 'event-updated';
  if (event.includes('Liked')) return 'event-liked';
  return 'event-viewed';
};

const AuditLog = () => {
  const { logs, refreshAuditLog } = useAuditLog();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`audit-log-container ${isOpen ? 'open' : 'closed'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='audit-toggle'
        title={isOpen ? 'Close audit log' : 'Open audit log'}
      >
        {isOpen ? '◀' : '▶'}
      </button>
      {isOpen && (
        <div className='audit-log-content'>
          <div className='audit-log-header'>
            <h3>Audit Log</h3>
            <button
              className='audit-refresh'
              onClick={refreshAuditLog}
              title='Refresh'
            >
              ↻
            </button>
          </div>
          <Divider spacing='sm' />
          <div className='log-entries'>
            {logs &&
              logs.map((log, index) => (
                <div
                  className={`log-entry ${eventClass(log.event)}`}
                  key={index}
                >
                  <p>{new Date(log.timestamp).toLocaleString()}</p>
                  <span>
                    <span className='log-username'>{log.username}</span>
                    <span className='log-event'> - {log.event} - </span>
                    {log.data.title && (
                      <span className='log-title'>{log.data.title}</span>
                    )}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
