import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import StyleGuide from './pages/StyleGuide';
import Home from './pages/Home';
import DoodleDetail from './pages/DoodleDetail';
import About from './pages/About';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='style-guide' element={<StyleGuide />} />
          <Route path='doodle/:id' element={<DoodleDetail />} />
          <Route path='about' element={<About />} />
          <Route path='login' element={<Login />} />
          <Route path='upload' element={<Upload />} />
          <Route path='admin' element={<Admin />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
