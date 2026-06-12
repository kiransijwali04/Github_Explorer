import { FaHistory, FaTrashAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RecentSearches = ({ history, onSearch, onRemove, onClear }) => {
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto mt-6 bg-gray-900/20 rounded-2xl border border-gray-800/40 p-5 backdrop-blur-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <FaHistory className="text-indigo-400" /> Recent Searches
        </span>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer font-medium border-none bg-transparent"
        >
          <FaTrashAlt size={10} /> Clear History
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {history.map((item) => (
          <div
            key={item.username}
            className="flex items-center gap-2 bg-gray-950/60 border border-gray-800/80 rounded-full pl-2 pr-3 py-1 hover:border-indigo-500/50 hover:bg-gray-900/80 transition-all duration-200 group"
          >
            <img
              src={item.avatarUrl}
              alt={item.username}
              className="w-5 h-5 rounded-full object-cover"
            />
            <button
              onClick={() => onSearch(null, item.username)}
              className="text-xs text-gray-300 hover:text-white font-medium cursor-pointer border-none bg-transparent"
            >
              {item.name}
            </button>
            <button
              onClick={() => onRemove(item.username)}
              className="text-[10px] text-gray-600 hover:text-red-400 ml-1 transition-colors cursor-pointer border-none bg-transparent"
              title="Remove item"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentSearches;
