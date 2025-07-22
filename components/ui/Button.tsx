const Button = ({ children, onClick, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
  >
    {children}
  </button>
);
export default Button;
