import { NavLink } from 'react-router-dom';

export const Header = () => {
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
      </nav>
    </header>
  );
};
