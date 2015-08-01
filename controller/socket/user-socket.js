
var Cols = require('../../libs/common/common-utils.js').Cols;

module.exports = function(io,socket,listUsersOnline){

    var updateListUsersOnline = function () {
        io.emit("Online People", listUsersOnline);
    };


    socket.on('Logged', function (user) {
        delete user.isLogin;
        socket.user = user;
        socket.user.timeOnline = new Date();
        if (!Cols.find(listUsersOnline, function (v) {return v._id == user._id})) {
            listUsersOnline.push(socket.user);
            updateListUsersOnline();
        }
    });


    socket.on('disconnect', function () {
        if(!socket.user) return;
        listUsersOnline.splice(Cols.findIndex(listUsersOnline, function (u) {
            return u._id = socket.user._id
        }),1);
        updateListUsersOnline();

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