import { useState } from 'react';
import { fetchUserData, fetchUserRepos, fetchUserStats } from '../services/githubApi';
import SearchForm from './SearchForm';
import ErrorMessage from './ErrorMessage';
import RepoCard from './RepoCard';
import RepoDetailModal from './RepoDetailModal';
import LanguageAnalytics from './LanguageAnalytics';
import RepoFilters from './RepoFilters';
import Pagination from './Pagination';
import RecentSearches from './RecentSearches';
import ProfileHeader from './ProfileHeader';
import DeveloperStats from './DeveloperStats';
import { ProfileSkeleton, RepoListSkeleton } from './SkeletonLoader';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const ProfileViewer = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);

  // Pagination & Sorting state for user repos
  const [reposLoading, setReposLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('updated');
  const [order, setOrder] = useState('desc');

  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  const handleSearch = async (e, searchUser = username) => {
    if (e) e.preventDefault();
    const targetUser = searchUser.trim();
    if (!targetUser) return;

    setLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);
    setStatsData(null);
    setUsername(targetUser);
    
    // Reset filters
    setPage(1);
    setSort('updated');
    setOrder('desc');

    try {
      // Fetch user profile data, initial repositories, and custom stats from the Express backend proxy
      const [userData, reposData, statsResult] = await Promise.all([
        fetchUserData(targetUser),
        fetchUserRepos(targetUser, 1, 30, 'updated', 'desc'),
        fetchUserStats(targetUser),
      ]);

      setProfile(userData);
      setRepos(reposData);
      setStatsData(statsResult);

      // Add successfully searched profile to local history logs
      addToHistory(userData);
    } catch (err) {
      setError(err.message || 'Failed to retrieve user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadRepos = async (targetUser, pageNum, sortValue, orderValue) => {
    setReposLoading(true);
    setError(null);
    try {
      const reposData = await fetchUserRepos(targetUser, pageNum, 30, sortValue, orderValue);
      setRepos(reposData);
    } catch (err) {
      setError(err.message || 'Failed to retrieve user repositories.');
    } finally {
      setReposLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadRepos(profile.login, newPage, sort, order);
  };

  const handleFilterChange = (type, value) => {
    const nextSort = type === 'sort' ? value : sort;
    const nextOrder = type === 'order' ? value : order;

    if (type === 'sort') setSort(value);
    else setOrder(value);

    setPage(1);
    loadRepos(profile.login, 1, nextSort, nextOrder);
  };

  const hasContent = profile || repos.length > 0 || error || loading;
  const totalPages = profile ? Math.ceil(profile.public_repos / 30) : 0;

  return (
    <div
      className={`bg-transparent py-8 px-4 w-full ${
        hasContent ? 'min-h-full' : 'h-full flex items-center justify-center'
      }`}
    >
      <div className="max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {!profile && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
                GitHub <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Profile Viewer</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
                Explore comprehensive GitHub developer profiles, repository metrics, and interactive programming language insights.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <SearchForm
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onSubmit={(e) => handleSearch(e)}
          placeholder="Enter GitHub username (e.g. torvalds)..."
          loading={loading}
        />

        {/* Search History Block */}
        {!profile && !loading && (
          <RecentSearches
            history={history}
            onSearch={handleSearch}
            onRemove={removeFromHistory}
            onClear={clearHistory}
          />
        )}

        {error && <ErrorMessage message={error} />}

        {loading && (
          <div className="space-y-8 mt-6">
            <ProfileSkeleton />
            <div className="space-y-4">
              <div className="h-6 bg-gray-900 rounded w-1/4 animate-pulse" />
              <RepoListSkeleton count={3} />
            </div>
          </div>
        )}

        {!loading && profile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 mt-6"
          >
            {/* Header Profile Card */}
            <ProfileHeader profile={profile} />

            {/* Custom Aggregate Stats Dashboard */}
            <DeveloperStats statsData={statsData} />

            {/* Language Analytics Visualizations */}
            {statsData && (
              <LanguageAnalytics languages={statsData.languages} summary={statsData.summary} />
            )}

            {/* Top Starred Repositories Section */}
            {statsData && statsData.topRepos && statsData.topRepos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/20 border border-gray-800/60 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                  <FaStar className="text-yellow-400" /> Starred Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statsData.topRepos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-gray-950/40 border border-gray-800/80 hover:border-purple-500/40 hover:bg-gray-950/80 transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {repo.name}
                        </div>
                        {repo.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{repo.description}</p>
                        )}
                      </div>
                      <div className="flex gap-4 mt-3 pt-2 border-t border-gray-800/20 text-xs text-gray-500">
                        {repo.language && (
                          <span className="flex items-center gap-1.5 font-medium text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-medium text-yellow-500">
                          <FaStar size={10} /> {repo.stars}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* General Repository Explorer Feed */}
            {repos.length > 0 && (
              <div className="pt-4">
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                  Repository Explorer <span className="text-sm font-normal text-gray-500">({profile.public_repos})</span>
                </h3>

                {/* Filters */}
                <RepoFilters
                  sort={sort}
                  order={order}
                  onSortChange={(v) => handleFilterChange('sort', v)}
                  onOrderChange={(v) => handleFilterChange('order', v)}
                  disabled={reposLoading}
                />

                {reposLoading ? (
                  <div className="mt-8">
                    <RepoListSkeleton count={3} />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {repos.map((repo) => (
                        <RepoCard
                          key={repo.id}
                          repo={repo}
                          showOwner={false}
                          variant="enhanced"
                          onClick={() => setSelectedRepo(repo)}
                        />
                      ))}
                    </div>

                    <Pagination
                      currentPage={page}
                      totalPages={totalPages > 33 ? 33 : totalPages}
                      onPageChange={handlePageChange}
                      loading={reposLoading}
                    />
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {selectedRepo && (
        <RepoDetailModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </div>
  );
};

export default ProfileViewer;
