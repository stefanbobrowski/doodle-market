import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'default' | 'special' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

const Button = ({
  variant = 'default',
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      className={`btn ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
