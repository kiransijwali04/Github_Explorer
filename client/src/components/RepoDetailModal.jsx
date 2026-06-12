import { useEffect, useState, useRef } from 'react';
import { fetchRepositoryDetails } from '../services/githubApi';
import { formatDate, formatNumber, formatSize } from '../utils/format';
import { 
  FaStar, 
  FaClock, 
  FaCodeBranch, 
  FaEye, 
  FaExclamationCircle, 
  FaBalanceScale, 
  FaTimes, 
  FaSpinner, 
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaBoxOpen,
  FaCode
} from 'react-icons/fa';

const RepoDetailModal = ({ repo, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Focus management
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const previousActiveElement = document.activeElement;

    // Focus the modal content or close button initially
    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const owner = repo.owner.login;
        const repoName = repo.name;
        const data = await fetchRepositoryDetails(owner, repoName);
        setDetails(data);
      } catch (err) {
        setError(err.message || 'Failed to load details');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [repo, onClose]);

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md transition-opacity duration-300"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/60 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-800/60 bg-gray-950/40">
          <div className="flex items-center gap-3 min-w-0">
            {repo.owner?.avatar_url && (
              <img 
                src={repo.owner.avatar_url} 
                alt={repo.owner.login} 
                className="w-10 h-10 rounded-full border border-gray-700"
              />
            )}
            <div className="min-w-0">
              <span className="text-sm font-medium text-blue-400 block mb-0.5">@{repo.owner?.login}</span>
              <h2 id="modal-title" className="text-xl font-bold text-white truncate pr-4">
                {repo.name}
              </h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/80 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-gray-400 text-sm">Fetching detailed metrics...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <FaExclamationCircle className="w-12 h-12 text-red-500" />
              <h3 className="text-lg font-bold text-white">Failed to Load Metrics</h3>
              <p className="text-gray-400 text-sm max-w-sm">{error}</p>
              {error.includes('rate limit') && (
                <p className="text-xs text-yellow-500/85 max-w-xs mt-1">
                  GitHub limits unauthenticated API requests. Please try again in an hour.
                </p>
              )}
            </div>
          ) : details ? (
            <>
              {/* Description */}
              {details.description && (
                <div className="bg-gray-950/30 border border-gray-800/40 p-4 rounded-xl">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Description</h4>
                  <p className="text-gray-200 text-sm leading-relaxed">{details.description}</p>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-4 flex items-center gap-3">
                  <FaStar className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Stars</div>
                    <div className="text-lg font-bold text-white">{formatNumber(details.stargazers_count)}</div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-4 flex items-center gap-3">
                  <FaCodeBranch className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Forks</div>
                    <div className="text-lg font-bold text-white">{formatNumber(details.forks_count)}</div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-4 flex items-center gap-3">
                  <FaEye className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Watchers</div>
                    <div className="text-lg font-bold text-white">{formatNumber(details.subscribers_count || details.watchers_count)}</div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-4 flex items-center gap-3">
                  <FaExclamationCircle className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Open Issues</div>
                    <div className="text-lg font-bold text-white">{formatNumber(details.open_issues_count)}</div>
                  </div>
                </div>
              </div>

              {/* Detailed Specs list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800/40">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-800/30">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaBoxOpen className="text-gray-500 text-xs" /> Disk Size
                    </span>
                    <span className="text-white font-semibold">{formatSize(details.size)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-800/30">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaBalanceScale className="text-gray-500 text-xs" /> License
                    </span>
                    <span className="text-white font-semibold truncate max-w-[150px]" title={details.license?.name}>
                      {details.license ? details.license.spdx_id || details.license.name : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-800/30">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaCodeBranch className="text-gray-500 text-xs" /> Default Branch
                    </span>
                    <span className="text-white font-semibold font-mono text-xs px-2 py-0.5 bg-gray-850 rounded border border-gray-850 bg-gray-800">
                      {details.default_branch || 'main'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-800/30">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500 text-xs" /> Created
                    </span>
                    <span className="text-white font-semibold">{formatDate(details.created_at, { month: 'short' })}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-800/30">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaClock className="text-gray-500 text-xs" /> Last Update
                    </span>
                    <span className="text-white font-semibold">{formatDate(details.updated_at, { month: 'short' })}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1.5 border-b border-gray-800/30">
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaCode className="text-gray-500 text-xs" /> Primary Language
                    </span>
                    <span className="text-white font-semibold">{details.language || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Topics tags */}
              {details.topics && details.topics.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {details.topics.map(topic => (
                      <span 
                        key={topic} 
                        className="text-xs font-medium px-2.5 py-1 bg-blue-600/10 text-blue-400 rounded-full border border-blue-500/20 hover:bg-blue-600/20 hover:border-blue-500/40 transition-colors"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800/60 bg-gray-950/40 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
          {details && (
            <a 
              href={details.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              Open on GitHub <FaExternalLinkAlt className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoDetailModal;
