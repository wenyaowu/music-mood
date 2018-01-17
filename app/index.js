const mustacheExpress = require('mustache-express');
const configs = require('./configs');
const express = require('express');
const app = express();
const cookieSession = require('cookie-session');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', `${__dirname}/views`);

const redis = require('redis');
const client = redis.createClient(configs.redis.port, configs.redis.host);
app.use(cookieSession({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: { maxAge: 2628000000 },
    store: new (require('express-sessions'))({
        storage: 'redis',
        instance: client,
        collection: 'sessions',
        expire: 86400
    })
}));


app.use('/status', function(req, res) {
    res.send('ok');
});

module.exports = app;