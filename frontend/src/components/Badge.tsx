import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
  // Add other props like size, etc.
}

const Badge = ({ variant = 'default', children }: BadgeProps) => {
  return <span className={`badge badge--${variant}`}>{children}</span>;
};

export default Badge;
