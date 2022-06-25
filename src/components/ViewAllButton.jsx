const ViewAllButton = ({ children, onClick, visible }) => {
  if (!visible) return null;
  return (
    <button
      type="button"
      className="dark:text-white text-primary hover:underline transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ViewAllButton;
