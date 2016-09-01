'use strict';

var yelp    = require('../config/yelp');
var Bar     = require('../models/attend');


module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/api/place/:location', function(req, res, next) {    
        yelp.search({ term: 'bar', location: req.params.location }).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.send(err);
        });
    });
    
    app.get('/api/gps/:location', function(req, res, next) {    
        Bar.find({ }, function(err, ids) {
            if(err) throw err;
                
            console.log(req.params.location);
            yelp.search({ term: 'bar', ll: req.params.location }).then(function (data) {
                data.attends = ids;
                res.json(data);
            }).catch(function (err) {
                res.send(err);
            });
        });
    });

    app.get('/api/going/:id',isLoggedIn, function(req, res,next) {
        var newAttend = new Bar({
            barId       : req.params.id,
            user        : req.user.twitter.id,
        });
        newAttend.save(function(err){
            if(err) throw err;
            res.redirect('/');
        })
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
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect : '/profile', failureRedirect : '/login' }));

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}