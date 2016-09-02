var mongoose = require('mongoose');

var barSchema = mongoose.Schema({
    barId       : String,
    users       : [String]
});

module.exports = mongoose.model('Attend', barSchema);
