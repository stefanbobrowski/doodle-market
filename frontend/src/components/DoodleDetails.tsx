import { useState } from 'react';
import Button from './Button';
import Divider from './Divider';
import type { Doodle } from '../types/doodle';

interface DoodleDetailsProps {
  doodle: Doodle;
}

const DoodleDetails = ({ doodle }: DoodleDetailsProps) => {
  const [likes, setLikes] = useState(doodle.likes);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    try {
      const response = await fetch(`/api/doodles/${doodle.id}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like');
      const data = await response.json();
      setLikes(data.likes);
      setLiked(true);
    } catch (err) {
      console.error('Failed to increment like count', err);
    }
  };

  return (
    <div className='doodle-details'>
      <h1>{doodle.title}</h1>
      <div className='doodle-image'>
        <img src={doodle.imagePath} alt={doodle.title} />
      </div>
      <p className='doodle-description'>{doodle.description}</p>
      <div className='doodle-stats'>
        <span>{doodle.views} views</span>
        <Divider orientation='vertical' />
        <span>{likes} likes</span>
      </div>

      <Button
        onClick={handleLike}
        disabled={liked}
        aria-label='Like this doodle'
      >
        👍 {liked ? 'Liked' : 'Like'}
      </Button>

      <p className='doodle-price'>Price: ${doodle.price.toFixed(2)}</p>

      <Button variant='special' onClick={() => alert('Buy now!')}>
        Buy Now
      </Button>
    </div>
  );
};

export default DoodleDetails;
