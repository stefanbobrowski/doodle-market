import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const DEMO_ACCOUNTS = [
  {
    username: 'pixel_pete',
    password: 'pete123',
    role: 'User',
    balance: '$100',
  },
  { username: 'sketch_sam', password: 'sam123', role: 'User', balance: '$100' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillAccount = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className='login-page'>
      <h1>Sign In</h1>
      <p className='muted'>Use one of the demo accounts below to log in.</p>

      <div className='demo-accounts'>
        <h3>Demo Accounts</h3>
        <div className='demo-accounts-list'>
          {DEMO_ACCOUNTS.map((a) => (
            <Button
              key={a.username}
              className='demo-account-btn'
              onClick={() => fillAccount(a.username, a.password)}
            >
              <span className='demo-username'>{a.username}</span>
              <span className='demo-role muted'>{a.role}</span>
              <div>
                <span className='demo-role muted'>Starting Balance: </span>
                <span className='demo-balance'>{a.balance}</span>
              </div>
              <span className='demo-password muted'>pw: {a.password}</span>
            </Button>
          ))}
        </div>
      </div>

      <form className='login-form' onSubmit={handleSubmit}>
        <div className='form-field'>
          <label htmlFor='username'>Username</label>
          <input
            id='username'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete='username'
            required
          />
        </div>
        <div className='form-field'>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='current-password'
            required
          />
        </div>
        {error && (
          <pre>
            <code className='error'>Error: {error}</code>
          </pre>
        )}
        <button type='submit' className='btn default' disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
