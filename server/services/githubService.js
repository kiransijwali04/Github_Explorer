import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_API_URL = 'https://api.github.com';
const token = process.env.GITHUB_TOKEN;

const githubClient = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  timeout: 10000,
});

// Helper to handle Axios errors and extract clean messages
const handleAxiosError = (error, defaultMsg) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || '';

    if (status === 403 && message.includes('API rate limit')) {
      const resetHeader = error.response.headers['x-ratelimit-reset'];
      let resetMsg = '';
      if (resetHeader) {
        const resetDate = new Date(parseInt(resetHeader) * 1000);
        resetMsg = ` Resets at ${resetDate.toLocaleTimeString()}.`;
      }
      const err = new Error(`GitHub API rate limit exceeded.${resetMsg} Please try again later or add a GITHUB_TOKEN on the server.`);
      err.status = 429;
      throw err;
    }

    if (status === 404) {
      const err = new Error(`${defaultMsg} (Not Found)`);
      err.status = 404;
      throw err;
    }

    const err = new Error(message || defaultMsg);
    err.status = status || 500;
    throw err;
  } else if (error.request) {
    const err = new Error('Connection to GitHub API timed out. Please try again.');
    err.status = 504;
    throw err;
  } else {
    const err = new Error(error.message || defaultMsg);
    err.status = 500;
    throw err;
  }
};

/**
 * Fetch GitHub user profile details
 */
export const fetchUserProfile = async (username) => {
  try {
    const response = await githubClient.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'User not found');
  }
};

/**
 * Fetch public repos for a GitHub user (returns up to 100 repos for robust dashboard calculations)
 */
export const fetchUserRepos = async (username, page = 1, perPage = 100, sort = 'updated', direction = 'desc') => {
  try {
    let githubSort = 'updated';
    if (sort === 'name') {
      githubSort = 'full_name';
    } else if (sort === 'stars' || sort === 'forks') {
      githubSort = 'pushed'; // Fetch pushed first, sort by stars/forks in JS memory
    }

    const response = await githubClient.get(`/users/${username}/repos`, {
      params: {
        page,
        per_page: perPage,
        sort: githubSort,
        direction,
      },
    });

    let repos = response.data;
    if (sort === 'stars') {
      repos.sort((a, b) => {
        return direction === 'asc'
          ? a.stargazers_count - b.stargazers_count
          : b.stargazers_count - a.stargazers_count;
      });
    } else if (sort === 'forks') {
      repos.sort((a, b) => {
        return direction === 'asc'
          ? (a.forks_count || 0) - (b.forks_count || 0)
          : (b.forks_count || 0) - (a.forks_count || 0);
      });
    }
    return repos;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch repositories');
  }
};

/**
 * Search repositories globally
 */
export const searchRepositories = async (query, { page = 1, perPage = 30, sort = 'stars', order = 'desc' }) => {
  try {
    const response = await githubClient.get('/search/repositories', {
      params: {
        q: query,
        page,
        per_page: perPage,
        sort: sort === 'best match' ? '' : sort,
        order,
      },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Repository search failed');
  }
};

/**
 * Fetch individual repository details (topics, readme, etc.)
 */
export const fetchRepoDetails = async (owner, repo) => {
  try {
    const response = await githubClient.get(`/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch repository details');
  }
};
