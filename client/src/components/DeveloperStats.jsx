import { motion } from 'framer-motion';
import { FaStar, FaCodeBranch, FaExclamationCircle, FaDatabase } from 'react-icons/fa';

const DeveloperStats = ({ statsData }) => {
  if (!statsData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
          <FaStar size={18} />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-semibold">Total Stars</div>
          <div className="text-lg font-bold text-white">{statsData.summary.totalStars}</div>
        </div>
      </div>
      <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
          <FaCodeBranch size={18} />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-semibold">Total Forks</div>
          <div className="text-lg font-bold text-white">{statsData.summary.totalForks}</div>
        </div>
      </div>
      <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
          <FaExclamationCircle size={18} />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-semibold">Open Issues</div>
          <div className="text-lg font-bold text-white">{statsData.summary.openIssues}</div>
        </div>
      </div>
      <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
          <FaDatabase size={18} />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-semibold">Avg Repo Size</div>
          <div className="text-lg font-bold text-white">{statsData.summary.averageSizeKB} KB</div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeveloperStats;
