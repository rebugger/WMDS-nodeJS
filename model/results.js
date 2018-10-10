var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
// const crypto = require('crypto')
// const config = require('../config/config.js')

var resultsSchema = new Schema({
    time  : Date,
    url : String,
    pattern : String,
    identifier : String
})

module.exports = mongoose.model('results', resultsSchema);
