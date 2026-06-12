import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';

const SearchForm = ({ value, username, onChange, onSubmit, placeholder, loading, buttonText = 'Search' }) => {
  const inputValue = value !== undefined ? value : (username || '');

  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-8 w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-11 pr-10 py-3 bg-gray-900/40 backdrop-blur-sm border border-gray-800/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm sm:text-base shadow-inner"
          />
          {inputValue && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer"
              title="Clear search"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FaSpinner className="h-4 w-4 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-800/40 disabled:to-indigo-800/40 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/20 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] disabled:transform-none transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 whitespace-nowrap min-w-[100px] cursor-pointer disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <FaSpinner className="h-4 w-4 animate-spin" />
              Searching
            </>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;

