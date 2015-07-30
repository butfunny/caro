"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var mongojs = require('mongojs');
var databaseUrl = 'localhost:27017/caroOnline';
var collections = ['matchCaro'];
var db = mongojs(databaseUrl, collections);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use(express.static(__dirname+'/public'));

require('./controller/controller.js')(io,db,app);


http.listen(3000, function () {
    console.log("Server  running in port: 3000");
});