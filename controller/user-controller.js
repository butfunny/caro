var mongojs = require('mongojs');
var Cols = require('../libs/common/common-utils.js').Cols;


module.exports = function (app, db, passport) {

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/facebook/callback',
        function (req, res, next) {
            passport.authenticate('facebook', {}, function (err, user) {
                req.session.passport.user = user;
                req.session.save();
                res.redirect("http://192.168.1.14:3000/#/chat-room");
            })(req, res, next);
        }
    );

    app.get("/api/account", function (req, res) {
        if (req.session.passport.user) {
            res.json(req.session.passport.user);
        } else {
            res.end();
        }
    });



};