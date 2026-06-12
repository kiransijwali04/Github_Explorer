import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const RepoFilters = ({ sort, order, onSortChange, onOrderChange, disabled }) => {
  const selectClass = "px-4 py-2 bg-gray-900/40 border border-gray-800/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-900/60 cursor-pointer";
  return (
    <div className="flex flex-wrap items-center gap-6 mb-6 justify-center glass-card py-3 px-6 rounded-2xl border border-gray-800/60 backdrop-blur-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <FaSort className="text-gray-500" />
        <span className="text-gray-400 text-sm font-medium">Sort by:</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          disabled={disabled}
          className={selectClass}
        >

          <option value="name">Repository Name</option>
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
          <option value="updated">Last Updated</option>

        </select>
      </div>
      <div className="flex items-center gap-2">
        {order === 'asc' ? <FaSortUp className="text-gray-500" /> : <FaSortDown className="text-gray-500" />}
        <span className="text-gray-400 text-sm font-medium">Order:</span>
        <select
          value={order}
          onChange={(e) => onOrderChange(e.target.value)}
          disabled={disabled}
          className={selectClass}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default RepoFilters;
