import { useState, useEffect } from 'react';
import type { Doodle } from '../types/doodle';
import DoodleCard from '../components/DoodleCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/doodles') // Proxies to your Express backend
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setDoodles(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
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
  );
};

export default Home;
