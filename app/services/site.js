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

async function getRecentPlayedTracks() {
    const EXECUTIONS = 11;
    let results = [];
    let reducePromise = _.range(EXECUTIONS).reduce((promise) => {
        return promise.then((result) => {
            results = results.concat(result['tracks']);
            let nextUrl = result['next'];
            return spotify.getRecentPlayedTracks(nextUrl);
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
    let reducePromise = _.range(EXECUTIONS).reduce((promise) => {
        return promise.then((result) => {
            results = results.concat(result['tracks']);
            let nextUrl = result['next'];
            return spotify.getTopTracks(nextUrl);
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

module.exports = { exchangeAccessAndRefreshToken, getRecentPlayedTracks, getTopTracks };