import { useState, useEffect } from 'react';

const HISTORY_KEY = 'github_explorer_searches';

export const useSearchHistory = () => {
  const [history, setHistory] = useState([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load search history', err);
    }
  }, []);

  // Save history on change
  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (err) {
      console.error('Failed to save search history', err);
    }
  };

  const addToHistory = (profile) => {
    if (!profile || !profile.login) return;

    const newItem = {
      username: profile.login,
      name: profile.name || profile.login,
      avatarUrl: profile.avatar_url,
      timestamp: Date.now(),
    };

    // Filter out duplicates and limit to 8 items
    const filtered = history.filter((item) => item.username.toLowerCase() !== profile.login.toLowerCase());
    const updated = [newItem, ...filtered].slice(0, 8);
    saveHistory(updated);
  };

  const removeFromHistory = (username) => {
    const updated = history.filter((item) => item.username.toLowerCase() !== username.toLowerCase());
    saveHistory(updated);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};
