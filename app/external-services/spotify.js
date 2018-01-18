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

    //TODO: Handle access token timeout

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

    function getCurrentUserInfo() {
        return new Promise(function(resolve, reject) {
            let params = {
                method : 'GET',
                uri : `${API_URI}/me`,
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

    function getRecentPlayedTracks(nextUrl) {
        return new Promise(function(resolve, reject) {
            let params = {
                method : 'GET',
                uri : nextUrl ? nextUrl : `${API_URI}/me/player/recently-played`,
                qs : {
                    limit: 50
                },
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
                    resolve({
                        tracks : body['items'],
                        nextUrl : body['next']
                    });
                }
            })
        })
    }

    function getTopTracks(nextUrl) {
        return new Promise(function(resolve, reject) {
            let params = {
                method : 'GET',
                uri : nextUrl ? nextUrl :`${API_URI}/me/top/tracks`,
                json : true,
                qs : {
                    limit: 50
                },
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
                    resolve({
                        tracks : body['items'],
                        nextUrl : body['next']
                    });
                }
            })
        })
    }

    function getCurrentUserPlaylists(){
        return new Promise(function(resolve, reject) {
            let params = {
                method : 'GET',
                uri : `${API_URI}/me/playlists`,
                json : true,
                qs : {
                    limit: 50
                },
                headers : {
                    "Authorization" : `Bearer ${ACCESS_TOKEN}`
                }
            };
            request(params, function(error, response, body){
                onResponse(error, body, [], params, resolve, reject)
            })
        })
    }

    function onResponse(err, body, results, params, resolve, reject) {
        if (err) {
            reject(err)
        } else {
            results = results.concat(body['items']);
            if (body['next']) {
                params.uri = body['next'];
                request(params, function(err, response, body) {
                    if(response.statusCode!==200) {
                        onResponse(new Error(`Error while getting playlist, statusCode: ${response.statusCode}`))
                    } else {
                        onResponse(err, body, results, params, resolve, reject)
                    }
                })
            } else {
                resolve(results)
            }
        }
    }

    return { auth, getRecentPlayedTracks, getTopTracks, getCurrentUserInfo, getCurrentUserPlaylists }
};

module.exports = spotify;