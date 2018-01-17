const express = require('express');
const apiRouter = express.Router();
const apiController = require('../controllers/apis');

apiRouter.get('/spotify_callback', apiController.spotifyAuthCallback);

module.exports = apiRouter;