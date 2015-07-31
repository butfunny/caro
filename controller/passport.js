
var userDao = require("../dao/user-dao.js");

module.exports = function (db, passport) {

    passport.serializeUser(function (user, done) {
        done(null, user._id)
    });

    passport.deserializeUser(function (doc, done) {
        userDao.getUserById(db, doc._id, function (err, user) {
            if (!err) done(null, user);
            else done(err, null);
        })
    });

    require('./passport/facebook.js')(passport, db);


};


