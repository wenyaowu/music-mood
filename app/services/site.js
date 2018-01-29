const config = require('../configs');
const spotify = require('../external-services/spotify')({
    clientId : config.spotify.clientId,
    clientSecret : config.spotify.clientSecret,
    redirectUrl : config.spotify.redirectUrl
});
let _ = require('lodash');

async function exchangeAccessAndRefreshToken(code) {
    try {
        return await spotify.auth(code);
    } catch (err) {
        throw new Error('Error while making authentication request to Spotify');
    }
}

async function getCurrentUserInfo() {
    try {
        return await spotify.getCurrentUserInfo();
    } catch (err) {
        throw Error('Error while getting current user info', err.stack);
    }
}

async function getRecentPlayedTracks() {
    const EXECUTIONS = 11;
    let results = [];
    let reducePromise = _.range(EXECUTIONS).reduce((promise, idx) => {
        return promise.then((result) => {
            results = results.concat(result['tracks']);
            let nextUrl = result['next'];
            if(idx===0 || nextUrl) {
                return spotify.getRecentPlayedTracks(nextUrl);
            }
            else {
                return Promise.resolve({
                    tracks:[],
                    nextUrl:undefined
                })
            }
        }).catch((err) => {
            console.log('Error while retrieving recent played tracks', err.stack);
        })
    }, Promise.resolve({
        tracks:[],
        nextUrl:undefined
    }));
    await reducePromise;
    return results
}

async function getTopTracks() {
    const EXECUTIONS = 6; //Top 20 * 5 tracks
    let results = [];
    let reducePromise = _.range(EXECUTIONS).reduce((promise, idx) => {
        return promise.then((result) => {
            results = results.concat(result['tracks']);
            let nextUrl = result['next'];
            if (idx === 0 || nextUrl){
                return spotify.getTopTracks(nextUrl);
            } else {
                return Promise.resolve({
                    tracks:[],
                    nextUrl:undefined
                })
            }
        }).catch((err) => {
            console.log('Error while retrieving recent played tracks', err.stack);
        })
    }, Promise.resolve({
        tracks:[],
        nextUrl:undefined
    }));
    await reducePromise;
    return results
}

async function getCurrentUserPlaylists() {
    return await spotify.getCurrentUserPlaylists();
}

async function getPlaylistTracksByHref(href) {
    return await spotify.getPlaylistTracksByHref(href)
}



module.exports = { exchangeAccessAndRefreshToken, getCurrentUserInfo, getRecentPlayedTracks, getTopTracks, getCurrentUserPlaylists, getPlaylistTracksByHref };