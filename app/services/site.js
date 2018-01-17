const config = require('../configs');
const request = require('request');
const sessionKeys = require('../constants/sessionKeys');

function exchangeAccessAndRefreshToken(code) {
    return new Promise(function(resolve, reject){
        let params = {
            method : 'POST',
            uri : `${config.spotify.authBaseUrl}/api/token`,
            qs : {
                grant_type : "authorization_code",
                code : code,
                redirect_uri : config.spotify.redirectUrl
            },
            json : true,
            headers : {
                "Content-Type": 'application/x-www-form-urlencoded',
                "Authorization" : `Basic ${Buffer.from(`${config.spotify.clientId}:${config.spotify.clientSecret}`).toString('base64')}`
            }
        };
        request(params, function(error, response, body){
            if (error) {
                reject('Error while exchanging token', error.stack);
            } else if (response.statusCode!==200) {
                reject(`Error while exchanging token, statusCode: ${response.statusCode}`);
            } else {
                sessionStorage.setItem(sessionKeys.SPOTIFY_ACCESS_TOKEN, body['access_token']);
                sessionStorage.setItem(sessionKeys.SPOTIFY_REFRESH_TOKEN, body['refresh_token']);
                resolve(body);
            }
        })
    });

}

module.exports = { exchangeAccessAndRefreshToken };