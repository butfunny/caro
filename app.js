"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var mongojs = require('mongojs');
var databaseUrl = 'localhost:27017/caroOnline';
var collections = ['matchCaro','user'];
var db = mongojs(databaseUrl, collections);


var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var config = require('./config.json');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname+'/public'));
app.use(cookieParser());
app.use(session({secret: 'caro.online', resave: false, saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());

require('./controller/passport.js')(db,passport,config);

require('./controller/controller.js')(io,db,app,passport,config);


http.listen(3000, function () {
    console.log("Server URL: " + config.server_url);
    console.log("Server running in port: 3000");
});