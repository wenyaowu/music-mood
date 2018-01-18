const request = require('request');

const spotify = function(options) {

    if(!options.clientId || !options.clientSecret || !options.redirectUrl) {
        throw new Error('Please provide correct options');
    }
    const AUTH_URI = 'https://accounts.spotify.com';
    const API_URI = 'https://api.spotify.com/v1';

    const CLIENT_ID = options.clientId;
    const CLIENT_SECRET = options.clientSecret;
    const REDIRECT_URL = options.redirectUrl;

    let ACCESS_TOKEN;
    let REFRESH_TOKEN;

    function auth(code) {
        return new Promise(function(resolve, reject){
            let params = {
                method : 'POST',
                uri : `${AUTH_URI}/api/token`,
                qs : {
                    grant_type : "authorization_code",
                    code : code,
                    redirect_uri : REDIRECT_URL
                },
                json : true,
                headers : {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    "Authorization" : `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
                }
            };
            request(params, function(error, response, body){
                if (error) {
                    reject('Error while exchanging token', error.stack);
                } else if (response.statusCode!==200) {
                    reject(`Error while exchanging token, statusCode: ${response.statusCode}`);
                } else {
                    ACCESS_TOKEN = body['access_token'];
                    REFRESH_TOKEN = body['refresh_token'];
                    resolve(body);
                }
            })
        });
    }

    async function getRecentPlayedTracks() {
        return new Promise(function(resolve, reject) {
            let params = {
                method : 'GET',
                uri : `${API_URI}/me/player/recently-played`,
                json : true,
                headers : {
                    "Authorization" : `Bearer ${ACCESS_TOKEN}`
                }
            };
            request(params, function(error, response, body){
                if (error) {
                    reject('Error while exchanging token', error.stack);
                } else if (response.statusCode!==200) {
                    reject(`Error while exchanging token, statusCode: ${response.statusCode}`);
                } else {
                    resolve(body);
                }
            })
        })
    }


    return { auth, getRecentPlayedTracks }
};

module.exports = spotify;