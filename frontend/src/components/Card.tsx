import type { ReactNode } from 'react';

interface CardProps {
  variant?: 'default' | 'elevated' | 'bordered';
  children: ReactNode;
}

const Card = ({ variant = 'default', children }: CardProps) => {
  return (
    <div className={`card card--${variant}`}>
      <div className='card__body'>{children}</div>
    </div>
  );
};

export default Card;
