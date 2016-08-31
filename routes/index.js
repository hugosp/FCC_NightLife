'use strict';

var yelp = require('../config/yelp');


module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/api/:location', function(req, res, next) {    
        yelp.search({ term: 'bar', location: req.params.location }).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.send(err);
        });
    });



    // --------------------- HANDLE LOGINS/AUTH ---------------------------- 
    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') }); 
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect : '/profile', failureRedirect : '/' }));

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}