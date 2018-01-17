const config = require('../configs');
const buildUrl = require('build-url');
const siteService = require('../services/site');

function index(req, res){
    let spotifyAuthUrl = buildUrl(config.spotify.authBaseUrl, {
            path: 'authorize',
            queryParams: {
                client_id : config.spotify.clientId,
                response_type : 'code',
                redirect_uri : encodeURIComponent(config.spotify.redirectUrl),
                scope : encodeURIComponent('user-read-private,user-read-email')
            }
        });

    res.render('welcome', { spotifyAuthUrl : spotifyAuthUrl });
}

async function spotifyAuthCallback(req, res){
    if (req.query.code) {
        let response = await siteService.exchangeAccessAndRefreshToken(req.query.code);
        res.render('index', { accessToken: response['access_token']})
    } else {
        throw new Error('Error while authenticate with spotify', res.query.error);
    }
}
module.exports = { index, spotifyAuthCallback };