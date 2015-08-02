var FacebookStrategy = require('passport-facebook').Strategy;
var userDao = require("../../dao/user-dao.js");
var fs = require("fs");

module.exports = function (passport, db,config) {

    passport.use(new FacebookStrategy(
            {
                clientID: config.facebook_config.client_id,
                clientSecret: config.facebook_config.client_secret,
                callbackURL: config.server_url + '/auth/facebook/callback',
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
                                social_id: profile._json.id,
                                name:  profile._json.name,
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