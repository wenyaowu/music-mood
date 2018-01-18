const config = require('../configs');
const spotify = require('../external-services/spotify')({
    clientId : config.spotify.clientId,
    clientSecret : config.spotify.clientSecret,
    redirectUrl : config.spotify.redirectUrl
});

async function exchangeAccessAndRefreshToken(code) {
    try {
        return await spotify.auth(code);
    } catch (err) {
        throw new Error('Error while making authentication request to Spotify');
    }
}

async function getRecentPlayedTracks() {
    try {
        return await spotify.getRecentPlayedTracks();
    } catch (err) {
        throw new Error('Error while retrieving data from Spotify');
    }
}

module.exports = { exchangeAccessAndRefreshToken, getRecentPlayedTracks };