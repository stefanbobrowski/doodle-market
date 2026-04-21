interface ButtonProps {
  variant?: 'default' | 'primary' | 'ghost' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  children,
  onClick,
}) => {
  return (
    <button className={`btn btn--${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
