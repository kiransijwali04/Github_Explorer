import express from 'express';
import * as githubController from '../controllers/githubController.js';

const router = express.Router();

// Define proxy routes
router.get('/search/repos', githubController.searchRepos);
router.get('/repos/:owner/:repo', githubController.getRepoDetails);
router.get('/:username', githubController.getUserProfile);
router.get('/:username/repos', githubController.getUserRepos);
router.get('/:username/stats', githubController.getUserStats);

export default router;
