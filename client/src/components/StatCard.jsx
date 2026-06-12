const StatCard = ({ label, value }) => (
  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/80 rounded-xl p-5 text-center transition-all duration-300 hover:scale-[1.03] hover:border-gray-700/80 hover:shadow-lg hover:shadow-blue-500/5 group">
    <div className="text-gray-400 text-sm font-medium mb-1 transition-colors group-hover:text-gray-300">{label}</div>
    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
  </div>
);  
export default StatCard;