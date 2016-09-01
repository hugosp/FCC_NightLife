var mongoose = require('mongoose');

var barSchema = mongoose.Schema({
    barId       : String,
    user        : String,
});

module.exports = mongoose.model('Attend', barSchema);