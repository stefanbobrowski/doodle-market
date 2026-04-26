// frontend/src/pages/DoodleDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Doodle } from '../types/doodle';

const DoodleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [doodle, setDoodle] = useState<Doodle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDoodle = async () => {
      try {
        const response = await fetch(`/api/doodles/${id}`);
        if (!response.ok) throw new Error('Doodle not found');
        const data = await response.json();
        setDoodle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDoodle();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div>
        <Link to='/' className='back-link'>
          ← Back to Home
        </Link>
        <div className='error'>Error: {error}</div>
      </div>
    );
  if (!doodle) return <div>Doodle not found</div>;

  return (
    <div>
      <Link to='/'>← Back to Home</Link>
      <h1>{doodle.title}</h1>
      <img src={doodle.imagePath} alt={doodle.title} />
      <p>{doodle.description}</p>
      <p className='doodle-price'>Price: ${doodle.price}</p>
      <p>
        Views: {doodle.views} | Likes: {doodle.likes}
      </p>
      <Button variant='special' onClick={() => alert('Buy now!')}>
        Buy Now
      </Button>
    </div>
  );
};

export default DoodleDetail;
