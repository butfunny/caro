var mongojs = require('mongojs');
var Cols = require('../libs/common/common-utils.js').Cols;


module.exports = function (socket, io, db,listUsersOnline) {
    var updateListUsersOnline = function(){
        io.emit("Online People",listUsersOnline);
    };

    socket.on('nick name', function(nickName){
        if(!Cols.find(listUsersOnline,function(v){return v.username == nickName})){
            socket.nickName = nickName;
            listUsersOnline.push({username: socket.nickName});
            updateListUsersOnline();
            var message = {
                username: socket.nickName,
                message: "is joined"
            };
            io.emit("Login", {username: socket.nickName});
            io.emit("Message",message);

        }else{
            io.emit("ErrorNickName",true);
        }
    });

    socket.on('disconnect',function(){
        if(!socket.nickName) return;
        listUsersOnline.splice(Cols.findIndex(listUsersOnline,function(u){return u.username == socket.nickName }),1);
        updateListUsersOnline();
        var message = {
            username: socket.nickName,
            message: "is disconnected"
        };

        io.emit("Message",message);
        db.matchCaro.find({$or: [{player1: socket.nickName},{player2: socket.nickName}]},function(err,doc){
            if(doc.length > 0){
                io.emit("quitMatchCaro",doc[0]);
                db.matchCaro.remove({_id: mongojs.ObjectId(doc[0]._id)}, function (err,doc) {
                });
            }

        })
    });
}