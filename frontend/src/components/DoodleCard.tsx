import { Link } from 'react-router-dom';
import type { Doodle } from '../types/doodle';

const DoodleCard = (doodle: Doodle) => {
  return (
    <div className='doodle-card'>
      <Link to={`/doodle/${doodle.id}`} className='doodle-image'>
        <img src={doodle.imagePath} alt={doodle.title} title={doodle.title} />
      </Link>

      <div className='doodle-info'>
        <Link to={`/doodle/${doodle.id}`} className='doodle-title'>
          {doodle.title}
        </Link>
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
