import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DoodleCard from '../components/DoodleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Doodle } from '../types/doodle';

const Home = () => {
  const location = useLocation();
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoodles = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/doodles');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setDoodles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDoodles();
  }, [location.key]);

  return (
    <div className='flex'>
      <div className='flex-auto'>
        <h1>Welcome to Doodle Market</h1>
        <p className='muted'>Discover and share amazing doodles!</p>
        {loading && <LoadingSpinner />}
        {error && (
          <pre>
            <code className='error'>Error: {error}</code>
          </pre>
        )}
        {doodles && doodles.length > 0 && (
          <div className='grid'>
            {doodles.map((doodle) => (
              <DoodleCard key={doodle.id} {...doodle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
