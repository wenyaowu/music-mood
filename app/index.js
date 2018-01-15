const express = require('express');
const app = express();

app.use('/status', function(req, res) {
    res.send('ok');
});

module.exports = app;