var Yelp = require('yelp');
require('dotenv').config();


var yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
});

// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({ location: 'Borlänge' })
.then(function (data) {
  console.log(data);
})
.catch(function (err) {
  console.error(err);
});