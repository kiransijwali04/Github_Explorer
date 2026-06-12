import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = [
  '#58A6FF', // Github blue
  '#7C3AED', // Premium violet
  '#A855F7', // Bright purple
  '#34D399', // Emerald green
  '#F59E0B', // Amber orange
  '#EF4444', // Coral red
  '#EC4899', // Hot pink
  '#06B6D4', // Teal cyan
];

const LanguageAnalytics = ({ languages = [], summary = {} }) => {
  if (!languages || languages.length === 0) {
    return (
      <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/80 rounded-2xl p-6 text-center text-gray-400">
        No language analytics available for this profile.
      </div>
    );
  }

  // Format data for Recharts (Top 7 + Others if needed)
  const chartData = languages.slice(0, 6).map((lang) => ({
    name: lang.name,
    value: lang.count,
    percentage: lang.percentage,
    size: (lang.size / 1024).toFixed(1), // MB
  }));

  if (languages.length > 6) {
    const others = languages.slice(6);
    const otherCount = others.reduce((acc, curr) => acc + curr.count, 0);
    const otherSize = others.reduce((acc, curr) => acc + curr.size, 0);
    const totalCount = languages.reduce((acc, curr) => acc + curr.count, 0);
    chartData.push({
      name: 'Others',
      value: otherCount,
      percentage: parseFloat(((otherCount / totalCount) * 100).toFixed(1)),
      size: (otherSize / 1024).toFixed(1),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
    >
      {/* Donut Chart */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-6 flex flex-col justify-between">
        <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Language Distribution (by Repo Count)</h3>
        <div className="h-64 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0f0719" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 10, 25, 0.95)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'Plus Jakarta Sans',
                }}
                formatter={(value, name, props) => [`${value} Repos (${props.payload.percentage}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col text-center justify-center pointer-events-none">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Repos</span>
            <span className="text-3xl font-extrabold text-white">{summary.totalRepos || 0}</span>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-800/40">
          {chartData.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span className="text-xs text-gray-300 font-medium truncate" title={item.name}>
                {item.name} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart representing Repository Size by Language */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-2xl p-6 flex flex-col justify-between">
        <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Code Volume (MB per Language)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#8B949E" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#8B949E" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 10, 25, 0.95)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(value) => [`${value} MB`, 'Code Volume']}
              />
              <Bar dataKey="size" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-gray-500 text-center mt-2 italic">
          Aggregate code volume is calculated from repository byte sizes.
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageAnalytics;
