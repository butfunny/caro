"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var Cols = require('./libs/common/common-utils.js').Cols;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use(express.static(__dirname+'/public'));


var listUsersOnline = [];

io.on('connection', function(socket){

    socket.on('nick name', function(nickName){
        if(!Cols.find(listUsersOnline,function(v){return v.username == nickName})){
            socket.nickName = nickName;
            listUsersOnline.push({username: socket.nickName});
            updateListUsersOnline();
            var message = {
                username: socket.nickName,
                message: "is joined"
            };
            io.emit("Message",message);
            io.emit("ErrorNickName",false);

        }else{
            io.emit("ErrorNickName",true);
        }


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
    });

    var updateListUsersOnline = function(){
        io.emit("Online People",listUsersOnline);

    };


    socket.on('disconnect',function(){
        if(!socket.nickName) return;
        listUsersOnline.splice(Cols.findIndex(listUsersOnline,function(u){return u.username == socket.nickName }),1);
        updateListUsersOnline();
        var message = {
            username: socket.nickName,
            message: "is disconnected"
        };
        io.emit("Message",message);
    });



});


app.get("/api/room-chat/people-online",function(req,res){
    res.json(listUsersOnline);
});




http.listen(3000, function () {
    console.log("Server  running in port: 3000");
});