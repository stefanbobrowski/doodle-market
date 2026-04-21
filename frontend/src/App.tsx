import { Routes, Route } from 'react-router-dom';
import StyleGuide from './pages/StyleGuide';

function App() {
  return (
    <>
      <nav
        className='flex'
        style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-surface)',
          gap: 'var(--spacing-lg)',
        }}
      >
        <a href='/' className='text-primary'>
          Home
        </a>
        <a href='/style-guide' className='text-primary'>
          Style Guide
        </a>
      </nav>

      {/* Routes */}
      <Routes>
        <Route
          path='/'
          element={
            <h1 className='text-xl text-center'>Welcome to Doodle-Market</h1>
          }
        />
        <Route path='/style-guide' element={<StyleGuide />} />
      </Routes>
    </>
  );
}

export default App;
