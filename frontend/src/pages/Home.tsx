import { useState, useEffect } from 'react';
import type { Doodle } from '../types/doodle';

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
      {loading && <div>Loading...</div>}
      {error && <code className='error'>Error: {error}</code>}
      {doodles && doodles.length > 0 && (
        <div>
          {doodles.map((doodle) => (
            <div key={doodle.id}>
              <img src={doodle.imagePath} alt={doodle.title} />
              <span>{doodle.title}</span>
              <span>{doodle.description}</span>
              <span>${doodle.price}</span>
              <span>Views: {doodle.views}</span>
              <span>Likes {doodle.likes}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
