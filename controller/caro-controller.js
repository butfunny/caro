var Cols = require('../libs/common/common-utils.js').Cols;
var MatchCaroDao = require('../dao/match-caro-dao.js');

module.exports = function (app,socket, io, db) {

    app.post("/api/caro-room/createdMatch",function(req,res){
        MatchCaroDao.createMatchCaro(db,{player1: req.body.user}, function (err,match) {
            res.json(match);
        })
    });

    app.get("/api/caro-room/match/:id",function(req,res){
        var id = req.params.id;
        if(id.length == 12){
            MatchCaroDao.getMatchCaro(db,id,function(err,matchDetail){
                res.json(matchDetail);
            })
        }else{
            res.end();
        }


    });


    socket.on('JoinGame', function (info) {
        var id = info.match_id;
        var update = {
            player2: info.user
        };
        MatchCaroDao.updateMatchCaro(db,id,update,function(err,doc){
            io.emit('JoinedGame',{match_id: info.match_id});
        })
    });

    socket.on('sendPosCaro',function(pos){
        io.emit("getPosCaro",pos);
    });




    socket.on("QuitGame",function(MatchID){
        io.emit("quitMatchCaro",MatchID);
        MatchCaroDao.removeMatchCaro(db,MatchID._id);
    });


    socket.on('resetCaroChessBoard', function (Match) {
        io.emit('resetCaroChessBoard',Match);
    });


    socket.on('CaroChat',function(mes){
        io.emit("CaroChat",mes);
    })

};