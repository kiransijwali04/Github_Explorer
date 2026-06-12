import { useState, useEffect, useRef } from 'react';
import { searchRepositories } from '../services/githubApi';
import SearchForm from './SearchForm';
import RepoCard from './RepoCard';
import Pagination from './Pagination';
import ErrorMessage from './ErrorMessage';
import RepoFilters from './RepoFilters';
import RepoDetailModal from './RepoDetailModal';
import { RepoListSkeleton } from './SkeletonLoader';
import { useDebounce } from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const RepoExplorer = () => {
  const [query, setQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [sort, setSort] = useState('best match');
  const [order, setOrder] = useState('desc');
  const [selectedRepo, setSelectedRepo] = useState(null);

  const debouncedQuery = useDebounce(query, 600);
  const initialMount = useRef(true);
  const abortControllerRef = useRef(null);

  const performSearch = async (pageNum = 1, sortValue = sort, orderValue = order, searchQuery = query) => {
    const term = searchQuery.trim();
    if (!term) {
      setRepos([]);
      setTotalCount(0);
      setHasSearched(false);
      return;
    }

    // Abort previous running request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Set up new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setPage(pageNum);

    try {
      const data = await searchRepositories(
        term,
        {
          page: pageNum,
          perPage: 30,
          sort: sortValue,
          order: orderValue,
        },
        { signal: controller.signal }
      );
      setRepos(data.items || []);
      setTotalCount(data.total_count || 0);
      setHasSearched(true);
    } catch (err) {
      if (axios.isCancel(err)) {
        // Keystroke changed query, request was aborted silently
        return;
      }
      setError(err.message || 'Search failed');
      setRepos([]);
      setTotalCount(0);
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Trigger search on debounce query change
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    performSearch(1, sort, order, debouncedQuery);
  }, [debouncedQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    performSearch(1, sort, order, query);
  };

  const handleFilterChange = async (type, value) => {
    const nextSort = type === 'sort' ? value : sort;
    const nextOrder = type === 'order' ? value : order;

    if (type === 'sort') setSort(value);
    else setOrder(value);

    if (query.trim()) {
      await performSearch(1, nextSort, nextOrder, query);
    }
  };

  const totalPages = Math.ceil(totalCount / 30);
  const containerClass = `bg-transparent py-8 px-4 w-full ${
    hasSearched ? 'min-h-full' : 'h-full flex items-center justify-center'
  }`;

  return (
    <div className={containerClass}>
      <div className="max-w-7xl mx-auto w-full">
        <AnimatePresence>
          {!hasSearched && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
                Repository <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Explorer</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
                Search, filter, and drill down into open-source repositories from the entire GitHub ecosystem.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <SearchForm
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSubmit={handleSearchSubmit}
          placeholder="Search repositories (e.g., react, tailwind, deepseek)..."
          loading={loading}
          buttonText="Search"
        />

        {hasSearched && (
          <RepoFilters
            sort={sort}
            order={order}
            onSortChange={(v) => handleFilterChange('sort', v)}
            onOrderChange={(v) => handleFilterChange('order', v)}
            disabled={loading}
          />
        )}

        {error && <ErrorMessage message={error} className="max-w-3xl" />}

        {loading && (
          <div className="mt-8">
            <RepoListSkeleton count={6} />
          </div>
        )}

        {hasSearched && !loading && !error && (
          <div className="mb-6 text-center">
            <p className="text-gray-400 text-sm">
              Found <span className="text-white font-semibold">{totalCount.toLocaleString()}</span> repositories
            </p>
          </div>
        )}

        {!loading && repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {repos.map((repo, idx) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                >
                  <RepoCard
                    repo={repo}
                    showOwner={true}
                    variant="enhanced"
                    dateFormat={{ year: 'numeric', month: 'short', day: 'numeric' }}
                    onClick={() => setSelectedRepo(repo)}
                  />
                </motion.div>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages > 33 ? 33 : totalPages} // API rate limit max 1000 items
              onPageChange={(pageNum) => performSearch(pageNum, sort, order, query)}
              loading={loading}
            />
          </motion.div>
        )}

        {hasSearched && repos.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No repositories found. Try a different search query.</p>
          </div>
        )}
      </div>

      {selectedRepo && (
        <RepoDetailModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </div>
  );
};

export default RepoExplorer;
