var mongoose = require('mongoose');

var barSchema = mongoose.Schema({
    barId       : String,
    users: [
        { 
            userId: String
        }
    ]
});

module.exports = mongoose.model('Attend', barSchema);
