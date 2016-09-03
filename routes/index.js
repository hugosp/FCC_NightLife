'use strict';

var yelp    = require('../config/yelp');
var Bar     = require('../models/attend');


module.exports = function(app, passport) {
    
    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/api/place/:location', function(req, res, next) {    
        Bar.find({ }, function(err, ids) {
            if(err) throw err;
            yelp.search({ term: 'bar', location: req.params.location }).then(function (data) {
                data.attends = ids;
                res.json(data);
            }).catch(function (err) {
                res.send(err);
            });
        });
    });

    app.get('/api/gps/:location', function(req, res, next) {    
        Bar.find({ }, function(err, ids) {
            if(err) throw err;
            yelp.search({ term: 'bar', ll: req.params.location }).then(function (data) {
                data.attends = ids;
                res.json(data);
            }).catch(function (err) {
                res.send(err);
            });
        });
    });


    app.get('/api/going/:id', function(req, res,next) {
        if (req.isAuthenticated()) {
            var query = {'barId':req.params.id};
            var newNum = 0;
            
            Bar.findOne(query,function(err,docs) {
    	        if (err) throw err;
                if(docs == null) {
                    var newAttend = new Bar({
                        barId   : req.params.id,
                        users: [req.user.twitter.id]
                    });
                    newAttend.save(function(err){ if(err) throw err; });
                    newNum = 1;
                } else {
                    if(docs.users.indexOf(req.user.twitter.id) !== -1) {
                        Bar.update(query,{$pull: {users: req.user.twitter.id}}).exec();
                        newNum = docs.users.length - 1 ;
                    }else{
                        Bar.update(query,{$push: {users: req.user.twitter.id}}).exec();
                        newNum = docs.users.length + 1 ;
                    } 
                }
                res.json({error:false,message:'all OK!',num: newNum});
            });
        } else {
            res.json({error:true,message:'not logged in',num: newNum});
        }
    });

    
    app.get('/profile', isLoggedIn, function(req, res) {
        Bar.find({users: [req.user.twitter.id]},function(err, docs) {
            if(err) throw err;
            res.render('profile',{attend: docs});
        });
    });
    
    
    
    
    
    // --------------------- HANDLE LOGINS/AUTH ---------------------------- 
    
    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') }); 
    });

   app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect : '/profile', failureRedirect : '/login' }));
    
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { successRedirect : '/profile', failureRedirect : '/login' }));

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}

