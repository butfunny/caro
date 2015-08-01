
var userList = require("../user-list/user-list.js");
var Cols = require('../../libs/common/common-utils.js').Cols;



module.exports = function(io,socket,listUsersOnline){

    var updateListUsersOnline = function (userOnline) {
        io.emit("Online People", userOnline);
    };


    socket.on('Logged', function (user) {
        delete user.isLogin;
        socket.user = user;
        socket.user.timeOnline = new Date();
        if (!Cols.find(userList.getUserOnline(), function (v) {return v._id == user._id})) {
            userList.addNewUser(socket.user);
            updateListUsersOnline(userList.getUserOnline());
        }
    });


    socket.on('disconnect', function () {
        if(!socket.user) return;
        userList.removeUser(socket.user);
        updateListUsersOnline(userList.getUserOnline());

        //if (!socket.email) return;
        //listUsersOnline.splice(Cols.findIndex(listUsersOnline, function (u) {
        //    return u.email == socket.email
        //}), 1);
        //updateListUsersOnline();
        //var message = {
        //    username: socket.userName,
        //    message: "is disconnected"
        //};
        //
        //io.emit("Message", message);
        //db.matchCaro.find({$or: [{player1: socket.nickName}, {player2: socket.nickName}]}, function (err, doc) {
        //    if (doc.length > 0) {
        //        io.emit("quitMatchCaro", doc[0]);
        //        db.matchCaro.remove({_id: mongojs.ObjectId(doc[0]._id)}, function (err, doc) {
        //        });
        //    }
        //
        //})
    });

};