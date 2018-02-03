const request = require('request');

const lastfm = function(options){

    if(!options.apiKey || !options.secret || !options.redirectUrl) {
        throw new Error('Please provide correct options');
    }
    const AUTH_URI = 'http://www.last.fm/api/auth';
    const API_URI = 'lastfm://';

    const API_KEY = options.apiKey;
    const SECRET = options.secret;
    const REDIRECT_URL = options.redirectUrl;

};