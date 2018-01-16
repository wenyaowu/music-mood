const path = require('path');

const index = function(req, res){
    res.render('index');
};
module.exports = { index };