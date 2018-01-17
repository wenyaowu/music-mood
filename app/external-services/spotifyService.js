const spotify = function(options) {

    if(!options.clientId || !options.clientSecret || !options.redirectUrl) {
        throw new Error('Please provide correct options');
    }
    const AUTH_URI = 'https://accounts.spotify.com';
    const API_URI = 'https://api.spotify.com/v1';

    const CLIENT_ID = options.clientID;
    const CLIENT_SECRET = options.clientSecret;
    const REDIRECT_URL = options.redirectUrl;


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
                    resolve(body);
                }
            })
        });
    }


    return {}
};

