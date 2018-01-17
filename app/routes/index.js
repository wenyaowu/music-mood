const routes = (app) => {
    app.use('/api', require('./apis'));
    app.use('/', require('./site'));

};

module.exports = routes;