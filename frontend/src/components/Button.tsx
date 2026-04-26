import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'default' | 'special';
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

const Button = ({
  variant = 'default',
  children,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <button className={`btn ${variant}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
