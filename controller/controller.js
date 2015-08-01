
var Cols = require('../libs/common/common-utils.js').Cols;
var mongojs = require('mongojs');


module.exports = function(io,db,app,passport){
    var listUsersOnline = [];

    //API
    require('./user-controller.js')(app, db,passport);


    //Socket
    io.sockets.on('connection', function(socket){

        require('./socket/user-socket.js')(io,socket,listUsersOnline);
        require('./socket/caro-socket.js')(io,socket,listUsersOnline);
        require('./socket/chat-room-socket.js')(io,socket,listUsersOnline);
        require('./chat-room-controller.js')(app, socket,io,db,listUsersOnline);
        require('./caro-controller.js')(app,socket,io,db);


    });



};