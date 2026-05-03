import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <nav>
        <NavLink
          to='/'
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Doodle Market
        </NavLink>
        <NavLink
          to='/style-guide'
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Style Guide
        </NavLink>
        <NavLink
          to='/about'
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          About
        </NavLink>
        {user && (
          <NavLink
            to='/upload'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Upload
          </NavLink>
        )}
        {user?.role === 'admin' && (
          <NavLink
            to='/admin'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Admin
          </NavLink>
        )}
      </nav>
      <div className='header-auth'>
        {user ? (
          <>
            <span className='header-user'>
              <span className='muted'>Logged in as</span> {user.username}
              {user.role === 'admin' && (
                <span className='user-role-badge'>admin</span>
              )}
            </span>
            <span className='header-balance'>
              ${user.balance?.toFixed(2) ?? '0.00'}
            </span>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <NavLink
            to='/login'
            className={({ isActive }) => `btn ${isActive ? ' active' : ''}`}
          >
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
};
