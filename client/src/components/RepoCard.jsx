import { FaStar, FaClock, FaCodeBranch } from 'react-icons/fa';
import { formatDate, formatNumber } from '../utils/format';

const getLanguageColorClass = (lang) => {
  if (!lang) return 'bg-gray-500';
  switch (lang.toLowerCase()) {
    case 'javascript': return 'bg-yellow-450 bg-yellow-400';
    case 'typescript': return 'bg-blue-500';
    case 'python': return 'bg-blue-600';
    case 'java': return 'bg-amber-600';
    case 'c++': return 'bg-pink-600';
    case 'c#': return 'bg-purple-650 bg-purple-600';
    case 'go': return 'bg-cyan-500';
    case 'rust': return 'bg-orange-600';
    case 'html': return 'bg-orange-500';
    case 'css': return 'bg-indigo-500';
    case 'ruby': return 'bg-red-600';
    case 'php': return 'bg-indigo-400';
    default: return 'bg-emerald-500';
  }
};

const RepoCard = ({
  repo,
  showOwner = false,
  dateFormat = { year: 'numeric', month: 'long', day: 'numeric' },
  variant = 'default',
  onClick,
}) => {
  const isEnhanced = variant === 'enhanced';
  
  const baseClasses = `transition-all duration-300 border backdrop-blur-sm overflow-hidden flex flex-col justify-between ${
    onClick ? 'cursor-pointer hover:scale-[1.015]' : ''
  } ${
    isEnhanced
      ? 'glass-card rounded-xl p-5 border-gray-800/80 hover:border-purple-500/35 hover:shadow-lg hover:shadow-purple-500/5 hover:bg-gray-900/60'
      : 'glass-card rounded-lg p-5 border-gray-850 border-gray-800/50 hover:border-purple-500/25 hover:shadow-md hover:bg-gray-900/55'
  }`;

  const descriptionClamp = isEnhanced ? 'line-clamp-3' : 'line-clamp-2';
  const statsLayout = 'flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-gray-400';
  const linkClass = 'text-white font-bold hover:text-blue-400 transition-colors duration-200';

  const handleCardClick = (e) => {
    if (e.target.closest('a')) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={baseClasses} onClick={handleCardClick} role={onClick ? "button" : undefined}>
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold truncate">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                title={repo.full_name || repo.name}
              >
                {isEnhanced ? repo.name : (repo.full_name || repo.name)}
              </a>
            </h3>
            {showOwner && repo.owner && isEnhanced && (
              <p className="text-xs text-gray-500 mt-0.5">by @{repo.owner.login}</p>
            )}
          </div>

          {repo.private && (
            <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold bg-yellow-600/20 text-yellow-500 border border-yellow-500/30 rounded-full">
              Private
            </span>
          )}
        </div>

        {repo.description && (
          <p className={`text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed ${descriptionClamp}`}>
            {repo.description}
          </p>
        )}
      </div>

      <div className="space-y-3 mt-auto pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {repo.language && (
            <div className="flex items-center text-xs font-semibold text-gray-300">
              <span className={`w-2.5 h-2.5 rounded-full mr-2 ${getLanguageColorClass(repo.language)}`} />
              {repo.language}
            </div>
          )}
        </div>

        <div className={statsLayout}>
          <span className="flex items-center gap-1" title="Stars">
            <FaStar className="w-3.5 h-3.5 text-yellow-500" /> {formatNumber(repo.stargazers_count)}
          </span>
          <span className="flex items-center gap-1" title="Forks">
            <FaCodeBranch className="w-3.5 h-3.5 text-blue-400" /> {formatNumber(repo.forks_count || 0)}
          </span>
          <span className="flex items-center gap-1 ml-auto text-gray-500 text-xs" title="Last Updated">
            <FaClock className="w-3.5 h-3.5 mr-0.5" /> {formatDate(repo.updated_at, dateFormat)}
          </span>
        </div>

        {showOwner && repo.owner && !isEnhanced && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-800/40">
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="w-5 h-5 rounded-full border border-gray-700"
            />
            <span className="text-xs text-gray-400 font-medium">@{repo.owner.login}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoCard;

