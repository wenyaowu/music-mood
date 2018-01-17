const configs = require('./configs');
const app = require('./index');
require('./routes')(app);

app.listen(configs.express.port, function (error) {
    if (error) {
        console.log("Unable to listen for connections", error);
        process.exit(10);
    }
    console.log("Listen on port: " + configs.express.port);
});