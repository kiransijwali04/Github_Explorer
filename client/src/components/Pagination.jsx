const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  if (totalPages <= 1) return null;

  const btnClass = "px-4 py-2 bg-gray-900/40 hover:bg-purple-600/20 hover:text-purple-300 hover:border-purple-500/30 disabled:bg-gray-950/20 disabled:cursor-not-allowed disabled:text-gray-600 text-gray-200 font-medium rounded-lg transition-all border border-gray-800 disabled:border-gray-900 shadow-md hover:scale-[1.03] active:scale-[0.98] disabled:transform-none cursor-pointer disabled:pointer-events-none";
  
  return (
    <div className="flex justify-center items-center mt-8 space-x-4">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1 || loading} 
        className={btnClass}
      >
        Previous
      </button>
      <span className="px-4 py-2 glass-card border border-gray-800/80 text-gray-400 font-medium rounded-lg text-sm backdrop-blur-sm"> 
        Page <span className="text-gray-200 font-semibold">{currentPage}</span> of <span className="text-gray-200 font-semibold">{totalPages}</span>
      </span>
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages || loading} 
        className={btnClass}
      >
        Next
      </button>
    </div>
  );  
};

export default Pagination;

