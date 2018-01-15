var path = require("path");
var environments = ['development', 'production'];

/* Default environment */
if(environments.indexOf(process.env.NODE_ENV) == -1){
    process.env.NODE_ENV = 'development';
}

