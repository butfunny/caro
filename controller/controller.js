
var Cols = require('../libs/common/common-utils.js').Cols;
var mongojs = require('mongojs');


module.exports = function(io,db,app,passport){
    var listUsersOnline = [];



    io.on('connection', function(socket){

        require('./user-controller.js')(app,socket, io, db,listUsersOnline,passport);
        require('./chat-room-controller.js')(app, socket,io,db,listUsersOnline);
        require('./caro-controller.js')(app,socket,io,db);


    });



};