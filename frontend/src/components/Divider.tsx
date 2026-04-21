import React from 'react';

interface DividerProps {
  spacing?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}

const Divider: React.FC<DividerProps> = ({
  spacing = 'md',
  orientation = 'horizontal',
}) => {
  return (
    <hr
      className={`divider divider--${orientation} divider--spacing-${spacing}`}
    />
  );
};

export default Divider;
