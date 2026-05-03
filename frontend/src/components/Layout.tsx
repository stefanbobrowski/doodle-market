import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import AuditLog from './AuditLog';

export const Layout = () => {
  return (
    <div className='layout'>
      <Header />
      <main className='main-content'>
        <Outlet />
      </main>
      <Footer />
      <AuditLog />
    </div>
  );
};
