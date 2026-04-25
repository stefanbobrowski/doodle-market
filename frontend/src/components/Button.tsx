import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'default' | 'special';
  children: ReactNode;
  onClick?: () => void;
}

const Button = ({ variant = 'default', children, onClick }: ButtonProps) => {
  return (
    <button className={`btn ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
