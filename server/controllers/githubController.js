import NodeCache from 'node-cache';
import * as githubService from '../services/githubService.js';

// Cache instance with standard TTL of 60 seconds (1 minute)
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Helper to wrap cache key generation
const getCacheKey = (prefix, suffix) => `${prefix}:${suffix.toLowerCase().trim()}`;

/**
 * Controller to fetch User Profile
 */
export const getUserProfile = async (req, res, next) => {
  const { username } = req.params;
  const cacheKey = getCacheKey('profile', username);

  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    const profile = await githubService.fetchUserProfile(username);
    cache.set(cacheKey, profile);

    res.setHeader('X-Cache', 'MISS');
    return res.json(profile);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch User Repositories
 */
export const getUserRepos = async (req, res, next) => {
  const { username } = req.params;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 30;
  const sort = req.query.sort || 'updated'; // stars, name, updated
  const order = req.query.order || 'desc';
  const cacheKey = getCacheKey('repos', `${username}_${page}_${perPage}_${sort}_${order}`);

  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    const repos = await githubService.fetchUserRepos(username, page, perPage, sort, order);
    cache.set(cacheKey, repos);

    res.setHeader('X-Cache', 'MISS');
    return res.json(repos);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to calculate aggregated statistics and analytics for a user
 */
export const getUserStats = async (req, res, next) => {
  const { username } = req.params;
  const cacheKey = getCacheKey('stats', username);

  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    // Fetch up to 100 repositories to compute statistics
    const repos = await githubService.fetchUserRepos(username, 1, 100);

    let totalStars = 0;
    let totalForks = 0;
    let openIssues = 0;
    let totalSize = 0;
    const languagesMap = {};

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      openIssues += repo.open_issues_count || 0;
      totalSize += repo.size || 0;

      const lang = repo.language;
      if (lang) {
        if (!languagesMap[lang]) {
          languagesMap[lang] = {
            name: lang,
            count: 0,
            size: 0,
          };
        }
        languagesMap[lang].count += 1;
        languagesMap[lang].size += repo.size || 0;
      }
    });

    // Format languages into list and calculate percentage
    const languages = Object.values(languagesMap);
    const totalReposWithLang = languages.reduce((acc, curr) => acc + curr.count, 0);

    languages.forEach((lang) => {
      lang.percentage = totalReposWithLang > 0 ? parseFloat(((lang.count / totalReposWithLang) * 100).toFixed(1)) : 0;
    });

    // Sort languages by count descending
    languages.sort((a, b) => b.count - a.count);

    // Get top 5 starred repos
    const topRepos = [...repos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url,
      }));

    const stats = {
      username,
      summary: {
        totalRepos: repos.length,
        totalStars,
        totalForks,
        openIssues,
        totalSizeKB: totalSize,
        averageSizeKB: repos.length > 0 ? parseFloat((totalSize / repos.length).toFixed(1)) : 0,
      },
      languages,
      topRepos,
    };

    cache.set(cacheKey, stats);

    res.setHeader('X-Cache', 'MISS');
    return res.json(stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for searching repositories globally
 */
export const searchRepos = async (req, res, next) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 30;
  const sort = req.query.sort || 'stars';
  const order = req.query.order || 'desc';

  const cacheKey = getCacheKey('search', `${q}_${page}_${perPage}_${sort}_${order}`);

  try {
    if (!q) {
      return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    // Since GitHub search API doesn't support sorting by name directly,
    // fetch with default sorting (stars) and sort alphabetically in memory.
    const searchSort = sort === 'name' ? 'stars' : sort;
    const result = await githubService.searchRepositories(q, { page, perPage, sort: searchSort, order });

    if (sort === 'name') {
      result.items = (result.items || []).sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
    }

    cache.set(cacheKey, result);

    res.setHeader('X-Cache', 'MISS');
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch specific repository details
 */
export const getRepoDetails = async (req, res, next) => {
  const { owner, repo } = req.params;
  const cacheKey = getCacheKey('repo_details', `${owner}_${repo}`);

  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    const details = await githubService.fetchRepoDetails(owner, repo);
    cache.set(cacheKey, details);

    res.setHeader('X-Cache', 'MISS');
    return res.json(details);
  } catch (error) {
    next(error);
  }
};
