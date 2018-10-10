var request = require('request');
var cheerio = require('cheerio');
var morgan = require('morgan');
var bodyParser = require('body-parser')
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
const readline = require('readline');
var fs = require('fs');
var html = require('html');
var async = require('async');
var express = require('express');
var timeout = require('connect-timeout')
// if(cluster.isMaster){
//     for(var i = 0; i < numCPUs; i++){
//         cluster.fork();
//     }

//     cluster.on('exit', function(worker, code, signal){
//         console.log('worker'+ worker.process.pid+ 'died' + 'signal : '+ signal);
//     })
// }
// else{
var app = express();
var port = 8080;
httpServer = require('http').createServer(app).listen(port);
var io = require('socket.io').listen(httpServer)

var asdf = 'htmlbody fucking'
io.on('connection', function(socket){
    console.log('cc');
    
    var incremental = 0;
    setInterval(function () {
        console.log('emit new value', incremental);

        socket.emit('update-value', asdf); // Emit on the opened socket.
        incremental++;
    }, 1000);

    socket.on('disconnect' , function(data){
        console.log('close');
    })

})
app.use(timeout('120s'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set('views','public/views');
app.set('view engine', 'pug');
app.use(require('./route/route'));
// app.use('/views',express.static('public'));
// app.use('/static', express.static(__dirname+'static'));
app.use('/image', express.static(__dirname+'/public/image'));
app.use('/css', express.static(__dirname+'/public/css'));

var db = require('./config/db')();
