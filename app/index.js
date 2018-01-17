const mustacheExpress = require('mustache-express');
const express = require('express');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', `${__dirname}/views`);

app.use('/status', function(req, res) {
    res.send('ok');
});

module.exports = app;