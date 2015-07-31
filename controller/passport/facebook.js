var FacebookStrategy = require('passport-facebook').Strategy;
var userDao = require("../../dao/user-dao.js");
var fs = require("fs");

module.exports = function (passport, db) {

    passport.use(new FacebookStrategy(
            {
                clientID: "932673653463379",
                clientSecret: "ed1de97d2bcfcf20930abc9c64084af7",
                callbackURL: 'http://192.168.1.14:3000/auth/facebook/callback',
                passReqToCallback: true,
                profileFields: ['id', 'displayName', 'photos', 'emails']
            },
            function (req, token, refreshToken, profile, done) {
                process.nextTick(function () {

                    userDao.getUserByEmail(db, profile.emails[0].value, function (err, user) {
                        if (err) return done(err);
                        if (user) {
                            return done(null, user);
                        } else {
                            var newUser = {
                                email: profile.emails[0].value,
                                facebook: profile._json,
                                avatar: profile.photos[0].value
                            };

                            userDao.insertUsers(db, newUser, function (err, user) {
                                return done(null, user);
                            });
                        }
                    });
                });
            })
    );

};