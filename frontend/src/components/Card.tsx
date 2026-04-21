import React from 'react';

interface CardProps {
  variant?: 'default' | 'elevated' | 'bordered';
  children: React.ReactNode;
  // Add other props like variant, padding, etc.
}

const Card: React.FC<CardProps> = ({ variant = 'default', children }) => {
  return (
    <div className={`card card--${variant}`}>
      <div className='card__body'>{children}</div>
    </div>
  );
};

export default Card;
