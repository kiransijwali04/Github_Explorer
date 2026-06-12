const NavButton = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden text-sm cursor-pointer ${
      isActive
        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10'
        : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent'
    }`}
  >
    {children}
    {isActive && (
      <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
    )}
  </button>
);

export default NavButton;