var socketio = require('socket.io'),
    net = require('net'),
    redis = require('redis'),
    path = require('path');

var $ = require('jquery'); 

var utils = require('./utils.js');

var config = utils.load_config('config.yaml')

/* Express */

var express = require('express');
var app = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));  
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res){
  res.render('index');
});

app.listen(config.node.port);

/* Redis PUB/SUB */

var io = require('socket.io').listen(app)
//var client = redis.createClient(config.redis.port, config.redis.host);

io.configure(function() {
  io.set('log level', 1) 
});

io.sockets.on('connection', function (socket) {
  check_services(socket);
  //client.on("message", function (channel, message) {
    //socket.emit('message', message);
  //});
});

//client.subscribe(config.redis.channel);

function check_services(socket) {

  var data = [ ];
  var host = 'localhost';
  var services_count = count = config.services.length;

  for (var i=0; i <= (services_count - 1); i++) {
    var callback = function(service, status) {
      data.push({ 'name': service.name, 'status': status } );
      count--;
      if (count == 0) {
        socket.emit('message', data.sort(compare));
      }
    }
    check_port(config.services[i].port, host, config.services[i], socket, callback);
  }

  setTimeout(check_services, 1000, socket);
}

function compare(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function check_port(port, host, service, socket, callback) {
  try {
    var client = net.createConnection(port, host);

    var timeout_id = setTimeout(function() {
      clearTimeout(timeout_id);
      console.log('client connection timed out');
      client.end();
      callback(service, 'warning');
    }, 1000);

    client.on('connect', function() {
      clearTimeout(timeout_id);
      //console.log('client connected');
      callback(service, 'ok');
      client.end();
    });

    client.on('error', function() { 
      clearTimeout(timeout_id);
      //console.log('client connection error'); 
      callback(service, 'error');
      client.end(); 
    });

  } catch(err) {
    console.log(err);
  }
}