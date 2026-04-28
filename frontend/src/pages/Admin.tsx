import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user, token, updateBalance } = useAuth();
  const navigate = useNavigate();

  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleReset = async () => {
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      updateBalance(1000);
      setResetSuccess(true);
      setConfirmReset(false);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className='admin-page'>
      <h1>Admin Dashboard</h1>
      <p className='muted'>
        Logged in as <strong>{user.username}</strong>.
      </p>

      <div className='admin-section'>
        <h2>Reset to Seed</h2>
        <p className='muted'>
          Deletes all user-uploaded doodles, restores the 5 seed doodles, and
          resets all account balances to their starting amounts. This cannot be
          undone.
        </p>

        {resetSuccess && (
          <p className='admin-success'>
            Reset complete. Everything is back to seed state.
          </p>
        )}

        {resetError && (
          <pre>
            <code className='error'>Error: {resetError}</code>
          </pre>
        )}

        {confirmReset ? (
          <div className='confirm-reset'>
            <span className='muted'>
              Are you sure? This will wipe all user content.
            </span>
            <div className='confirm-reset-actions'>
              <button
                className='btn danger'
                onClick={handleReset}
                disabled={resetLoading}
              >
                {resetLoading ? 'Resetting…' : 'Yes, Reset Everything'}
              </button>
              <button
                className='btn default'
                onClick={() => setConfirmReset(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className='btn danger' onClick={() => setConfirmReset(true)}>
            Reset to Seed
          </button>
        )}
      </div>
    </div>
  );
};

export default Admin;
