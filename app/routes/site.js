const express = require('express');
const siteRouter = express.Router();
const siteController = require('../controllers/site');

siteRouter.get('/', siteController.index);

module.exports = siteRouter;