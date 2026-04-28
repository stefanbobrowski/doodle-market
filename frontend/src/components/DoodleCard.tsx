import { Link } from 'react-router-dom';
import type { Doodle } from '../types/doodle';
import { useAuth } from '../context/AuthContext';

const DoodleCard = (doodle: Doodle) => {
  const { user } = useAuth();
  const isOwner = user && (user.id === doodle.userId || user.role === 'admin');

  return (
    <div className='doodle-card'>
      <Link to={`/doodle/${doodle.id}`} className='doodle-image'>
        <img src={doodle.imagePath} alt={doodle.title} title={doodle.title} />
      </Link>

      <div className='doodle-info'>
        <div className='doodle-title-row'>
          <Link to={`/doodle/${doodle.id}`} className='doodle-title'>
            {doodle.title}
          </Link>
          {isOwner && <span className='owner-badge'>yours</span>}
        </div>
        <span className='doodle-description'>{doodle.description}</span>
        <div className='doodle-stats'>
          <span className='doodle-views'>{doodle.views} views</span>
          <span className='doodle-likes'>{doodle.likes} likes</span>
        </div>
        <span className='doodle-price'>${doodle.price.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default DoodleCard;
