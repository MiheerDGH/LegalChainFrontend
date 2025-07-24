const Button = ({
  children,
  onClick,
  disabled,
  variant = 'primary',
}: {
  children: React.ReactNode;
  onClick?: () => void; // ✅ Now optional
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) => {
  const baseStyles =
    'font-semibold px-4 py-2 rounded disabled:opacity-50 transition';

  const variantStyles =
    variant === 'secondary'
      ? 'bg-gray-300 hover:bg-gray-400 text-black'
      : 'bg-yellow-400 hover:bg-yellow-500 text-black';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles}`}
    >
      {children}
    </button>
  );
};

export default Button;
