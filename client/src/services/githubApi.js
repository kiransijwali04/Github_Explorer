import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/github';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Response interceptor to extract data and handle rate limits/errors uniformly
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    let message = 'An unexpected network error occurred';
    if (error.response) {
      message = error.response.data?.message || message;
    } else if (error.request) {
      message = 'Could not contact the proxy server. Make sure the backend server is running and accessible.';
    }
    return Promise.reject(new Error(message));
  }
);

export const fetchUserData = async (username) => {
  const response = await api.get(`/${username}`);
  return response.data;
};

export const fetchUserRepos = async (username, page = 1, perPage = 30, sort = 'updated', order = 'desc') => {
  const response = await api.get(`/${username}/repos`, {
    params: { page, per_page: perPage, sort, order },
  });
  return response.data;
};

export const searchRepositories = async (query, { page = 1, perPage = 30, sort = 'stars', order = 'desc' } = {}, config = {}) => {
  const response = await api.get('/search/repos', {
    params: {
      q: query,
      page,
      per_page: perPage,
      sort,
      order,
    },
    ...config,
  });
  return response.data;
};

export const fetchRepositoryDetails = async (owner, repo) => {
  const response = await api.get(`/repos/${owner}/${repo}`);
  return response.data;
};

export const fetchUserStats = async (username) => {
  const response = await api.get(`/${username}/stats`);
  return response.data;
};
