import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import StyleGuide from './pages/StyleGuide';
import Home from './pages/Home';
import DoodleDetail from './pages/DoodleDetail';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='style-guide' element={<StyleGuide />} />
        <Route path='doodle/:id' element={<DoodleDetail />} /> {/* New route */}
      </Route>
    </Routes>
  );
}

export default App;
