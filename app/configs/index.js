const os = require('os');
const nconf = require("nconf");
const path = require("path");

const environments = ['development', 'production'];

/* Default environment */
if(environments.indexOf(process.env.NODE_ENV) === -1){
    process.env.NODE_ENV = 'development';
}
let config = {};

config.environment = process.env.NODE_ENV;

/* Developer local environment config override*/
nconf.argv()
    .env()
    .file('overrides', { file: path.join(__dirname, 'local.json')});

nconf.file('global', {file: path.join(__dirname, `${config.environment}.json`)});

config.spotify = nconf.get('spotify');
config.redis = nconf.get('redis');

config.express = {
    port : process.env.EXPRESS_PORT || 8090
};

module.exports = config;

