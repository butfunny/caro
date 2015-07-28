"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname+'/public'));

http.listen(3000, function () {
    console.log("Server  running in port: 3000");
});