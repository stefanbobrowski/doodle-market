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
  const [liked, setLiked] = useState(false);

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

  const handleLike = async () => {
    if (liked || !id) return;
    try {
      const response = await fetch(`/api/doodles/${id}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like');
      const data = await response.json();
      setDoodle((prev) => (prev ? { ...prev, likes: data.likes } : prev));
      setLiked(true);
    } catch (err) {
      console.error('Failed to increment like count', err);
    }
  };

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
      <button
        onClick={handleLike}
        disabled={liked}
        aria-label='Like this doodle'
      >
        👍 {liked ? 'Liked' : 'Like'}
      </button>
      <Button variant='special' onClick={() => alert('Buy now!')}>
        Buy Now
      </Button>
    </div>
  );
};

export default DoodleDetail;
