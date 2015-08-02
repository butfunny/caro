var mongojs = require('mongojs');
var Cols = require('../libs/common/common-utils.js').Cols;


module.exports = function (app, db, passport,config) {

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/facebook/callback',
        function (req, res, next) {
            passport.authenticate('facebook', {}, function (err, user) {
                req.session.passport.user = user;
                req.session.save();
                res.redirect(config.server_url + "/#/chat-room");
            })(req, res, next);
        }
    );

    app.get("/api/account", function (req, res) {

        req.session.passport.user = {
            _id : "55bd732a7ce5fb641f355e4c",
            email : "butfunny63@gmail.com",
            social_id : "720948878016701",
            name : "Nguyễn Mạnh Cường",
            avatar : "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpt1/v/t1.0-1/p50x50/11168518_718187278292861_8326480964586416161_n.jpg?oh=4c8f0a460d58aad88de9a307c47322b1&oe=564E2DF5&__gda__=1447365293_fc1af23e9ade14872d7135662c744994"
        };

        if (req.session.passport.user) {
            res.json(req.session.passport.user);
        } else {
            res.end();
        }
    });



};