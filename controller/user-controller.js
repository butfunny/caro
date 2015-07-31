var mongojs = require('mongojs');
var Cols = require('../libs/common/common-utils.js').Cols;


module.exports = function (app, socket, io, db, listUsersOnline, passport) {
    var updateListUsersOnline = function () {
        io.emit("Online People", listUsersOnline);
    };

    var getReferrer = function (req, res, next) {
        referrer = req.headers.referer;
        next()
    };
    
    var referrer = '';

    app.get('/auth/facebook', getReferrer, passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/facebook/callback',
        function (req, res, next) {
            passport.authenticate('facebook', {}, function (err, user) {
                req.session.passport.user = user;
                req.session.save();
                if (!Cols.find(listUsersOnline, function (v) {
                        return v.email == req.session.passport.user.email
                    })) {
                    var data = {
                        email: user.email,
                        userName: user.facebook.name,
                        avatar: user.facebook.picture.data.url
                    };
                    socket.email = user.email;
                    socket.userName = user.facebook.name;
                    listUsersOnline.push(data);
                    updateListUsersOnline();
                    var message = {
                        username: user.facebook.name,
                        message: "is joined"
                    };
                    io.emit("Message", message);
                }
                res.redirect(referrer+"#/chat-room");
            })(req, res, next);
        }
    );

    app.get("/api/account", function (req, res) {
        if (req.session.passport.user) {
            if (!Cols.find(listUsersOnline, function (v) {
                    return v.email == req.session.passport.user.email
                })) {
                var data = {
                    email: req.session.passport.user.email,
                    userName: req.session.passport.user.facebook.name,
                    avatar: req.session.passport.user.facebook.picture.data.url
                };
                socket.email = req.session.passport.user.email;
                socket.userName = req.session.passport.user.facebook.name;
                listUsersOnline.push(data);
                updateListUsersOnline();
                var message = {
                    username: req.session.passport.user.facebook.name,
                    message: "is joined"
                };
                io.emit("Login", {username: req.session.passport.user.facebook.name});
                io.emit("Message", message);
            }
            res.json(req.session.passport.user);

        } else {
            res.end();
        }
    });

    socket.on('nick name', function (nickName) {
        if (!Cols.find(listUsersOnline, function (v) {
                return v.username == nickName
            })) {
            socket.nickName = nickName;
            listUsersOnline.push({username: socket.nickName});
            updateListUsersOnline();
            var message = {
                username: socket.nickName,
                message: "is joined"
            };
            io.emit("Login", {username: socket.nickName});
            io.emit("Message", message);

        } else {
            io.emit("ErrorNickName", true);
        }
    });

    socket.on('disconnect', function () {
        if (!socket.email) return;
        listUsersOnline.splice(Cols.findIndex(listUsersOnline, function (u) {
            return u.email == socket.email
        }), 1);
        updateListUsersOnline();
        var message = {
            username: socket.userName,
            message: "is disconnected"
        };

        io.emit("Message", message);
        db.matchCaro.find({$or: [{player1: socket.nickName}, {player2: socket.nickName}]}, function (err, doc) {
            if (doc.length > 0) {
                io.emit("quitMatchCaro", doc[0]);
                db.matchCaro.remove({_id: mongojs.ObjectId(doc[0]._id)}, function (err, doc) {
                });
            }

        })
    });
}