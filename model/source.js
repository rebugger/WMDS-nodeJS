var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
// const crypto = require('crypto')
// const config = require('../config/config.js')

var SourceSchema = new Schema({
    source : String,
    identifier : String
})

module.exports = mongoose.model('Source', SourceSchema);
