const apiService = require('../services/apis');

function spotifyAuthCallback(req, res){
    if (req.query.code) {
        apiService.exchangeAccessAndRefreshToken(req.query.code);
    } else {
        throw new Error('Error while authenticate with spotify', res.query.error);
    }
};

module.exports = { spotifyAuthCallback };