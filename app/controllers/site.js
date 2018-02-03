const config = require('../configs');
const buildUrl = require('build-url');
const sessionKeys = require('../constants/sessionKeys');
const siteService = require('../services/site');

function index(req, res){
    let spotifyAuthUrl = buildUrl(config.spotify.authBaseUrl, {
            path: 'authorize',
            queryParams: {
                client_id : config.spotify.clientId,
                response_type : 'code',
                redirect_uri : encodeURIComponent(config.spotify.redirectUrl),
                scope : encodeURIComponent('user-read-private,user-read-email, user-top-read, user-read-recently-played')
            }
        });
    res.render('welcome', { spotifyAuthUrl : spotifyAuthUrl });
}

async function spotifyAuthCallback(req, res){
    if (req.query.code) {
        let response = await siteService.exchangeAccessAndRefreshToken(req.query.code);
        req.session[sessionKeys.SPOTIFY_ACCESS_TOKEN] = response['access_token'];
        req.session[sessionKeys.SPOTIFY_REFRESH_TOKEN] = response['refresh_token'];
        req.session[sessionKeys.CURRENT_USER] = await siteService.getCurrentUserInfo();

        let lastFmAuthUrl = buildUrl(config.lastfm.authBaseUrl, {
           path:'',
           queryParams: {
               api_key : config.lastfm.apiKey,
               cb : config.lastfm.redirectUrl
           }
        });
        res.render('index', { spotifyAccessToken: response['access_token'], lastfmAuthUrl : lastFmAuthUrl})
    } else {
        throw new Error('Error while authenticate with spotify', res.query.error);
    }
}

async function lastfmAuthCallBack(req, res) {
    if (req.query.token) {
        req.session[sessionKeys.LAST_FM_TOKEN] = req.query.token;
    }
    let spotifyAccessToken = req.session[sessionKeys.SPOTIFY_ACCESS_TOKEN];
    res.render('index', {spotifyAccessToken : spotifyAccessToken, lastfmAccessToken : req.query.token})
}

async function getRecentPlayedTracks(req, res) {
    let tracks = await siteService.getRecentPlayedTracks();
    res.render('historyTracksList', { tracks: tracks, num: tracks.length });
}

async function getTopTracks(req, res) {
    let tracks = await siteService.getTopTracks();
    res.render('tracksList', { tracks: tracks, num: tracks.length });
}

async function getCurrentUserPlaylists(req, res) {
    let playlists = await siteService.getCurrentUserPlaylists();
    res.render('playlistDropdownSection', { playlists: playlists });
}

async function getPlaylistTrackByHref(req, res) {
    let href = req.query.href;
    if(!href) {
        return res.status(400).send('Please provide valid href'); //TODO: Move validation to middleware
    }
    let playlistTracks = await siteService.getPlaylistTracksByHref(href);
    let tracks = playlistTracks.map((pt)=>{
       return pt.track;
    });
    res.render('tracksList', { tracks: tracks, num : tracks.length });
}

module.exports = { index, spotifyAuthCallback, getRecentPlayedTracks, getTopTracks, getCurrentUserPlaylists, getPlaylistTrackByHref, lastfmAuthCallBack };