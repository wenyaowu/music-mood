const express = require('express');
const siteRouter = express.Router();
const siteController = require('../controllers/site');

siteRouter.get('/', siteController.index);
siteRouter.get('/spotify_callback', siteController.spotifyAuthCallback);
siteRouter.get('/get-recent-played', siteController.getRecentPlayedTracks);
module.exports = siteRouter;