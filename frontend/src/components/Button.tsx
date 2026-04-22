import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'default' | 'primary' | 'ghost' | 'outline';
  children: ReactNode;
  onClick?: () => void;
}

const Button = ({ variant = 'default', children, onClick }: ButtonProps) => {
  return (
    <button className={`btn btn--${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
