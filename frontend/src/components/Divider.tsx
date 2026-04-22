interface DividerProps {
  spacing?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}

const Divider = ({
  spacing = 'md',
  orientation = 'horizontal',
}: DividerProps) => {
  return (
    <hr
      className={`divider divider--${orientation} divider--spacing-${spacing}`}
    />
  );
};

export default Divider;
