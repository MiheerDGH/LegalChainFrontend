const Button = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded disabled:opacity-50 transition"
  >
    {children}
  </button>
);

export default Button;
