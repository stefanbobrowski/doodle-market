import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DoodleDetails from '../components/DoodleDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Doodle } from '../types/doodle';

const DoodleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [doodle, setDoodle] = useState<Doodle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const incrementView = async () => {
      try {
        await fetch(`/api/doodles/${id}/view`, {
          method: 'POST',
        });
      } catch (err) {
        console.error('Failed to increment view count', err);
      }
    };

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
    incrementView();
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
      <Link to='/' className='back-link'>
        ← Back to Home
      </Link>
      <DoodleDetails doodle={doodle} />
    </div>
  );
};

export default DoodleDetail;
