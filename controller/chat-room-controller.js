
var Cols = require('../libs/common/common-utils.js').Cols;
var MatchCaroDao = require('../dao/match-caro-dao.js');

module.exports = function (app, socket, io, db,listUsersOnline) {


    app.get("/api/room-chat/people-online",function(req,res){
        res.json(listUsersOnline);
    });

    socket.on('Message Chat', function(msg){
        var message = {
            username: socket.nickName,
            message: msg,
            time: new Date()
        };
        io.emit("Message",message);

    });

    socket.on('Typing',function(msg){
        var message = {
            username: socket.nickName,
            message: msg
        };
        io.emit('Typing',message);
    });

    socket.on('StopTyping',function(msg){
        var message = {
            username: socket.nickName,
            message: msg
        };
        io.emit('StopTyping',message);
    });

    socket.on('FindMatch',function(msg){

        var user = Cols.find(listUsersOnline,function(u){return u.username == socket.nickName});
        user.status = "finding";
        var userWaiting = Cols.find(listUsersOnline,function(u){return u.status == "finding" && (u.username != socket.nickName)});
        if(userWaiting != null){
            var data = {
                player1: socket.nickName,
                player2: userWaiting.username
            };
            MatchCaroDao.createMatchCaro(db,data,function(err,match){
                io.emit('HasGame',match);
            });
            delete user.status;
            delete userWaiting.status;
        }

    });

};