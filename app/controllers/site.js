const config = require('../configs');
const buildUrl = require('build-url');



const index = function(req, res){
    let spotifyAuthUrl = buildUrl(config.spotify.authBaseUrl, {
            path: 'authorize',
            queryParams: {
                client_id : config.spotify.clientId,
                response_type : 'code',
                redirect_uri : encodeURIComponent(config.spotify.redirectUrl),
                scope : encodeURIComponent('user-read-private,user-read-email')
            }
        });

    res.render('index', {spotifyAuthUrl : spotifyAuthUrl});
};
module.exports = { index };