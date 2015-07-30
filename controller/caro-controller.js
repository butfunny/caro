var Cols = require('../libs/common/common-utils.js').Cols;
var mongojs = require('mongojs');


module.exports = function (app,socket, io, db) {



    app.get("/api/caro-room/match/:id",function(req,res){
        var id = req.params.id;

        db.matchCaro.findOne({_id: mongojs.ObjectId(id)},function(err,matchDetail){
            res.json(matchDetail);
        })
    });

    socket.on('sendPosCaro',function(pos){
        io.emit("getPosCaro",pos);
    });


    socket.on("QuitGame",function(MatchID){
        io.emit("quitMatchCaro",MatchID);
        db.matchCaro.remove({_id: mongojs.ObjectId(MatchID._id)}, function (err,doc) {

        });
    });


    socket.on('resetCaroChessBoard', function (Match) {
        io.emit('resetCaroChessBoard',Match);
    });


    socket.on('CaroChat',function(mes){
        io.emit("CaroChat",mes);
    })

};