var mongoose = require('mongoose');
var db = mongoose.connection;

module.exports = function(){
    db.on('error', console.error);
    db.once('open', function(){
    console.log('db open');
    })
    mongoose.connect('mongodb://localhost/crawler');
}

