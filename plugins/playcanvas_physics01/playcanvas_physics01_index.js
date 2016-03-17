/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

//Note this base function current set to the plugin module setup
var path = require('path');
var express = require('express');
var plugin = require('../../app/libs/plugin.js');
/*global getModules */
//var io;
//var socket;
//var db;
var pce;
//===============================================
// Config
//===============================================
module.exports._config = require('./index.json');
//===============================================
// Init Post
//===============================================

module.exports.initpost = function(){
	console.log('init post');
	pce = require('./playcanvas-engine.js');

	if(pce !=null){
		var io = plugin.get_socketio();
		if(io !=null){
			var socketiobroadcast=function(event,data){
				io.sockets.emit(event,data);
			}
			console.log('setup function?');
			pce.socketio_boardcast(socketiobroadcast);
		}
		var engineio = plugin.get_engineio();
		if(engineio !=null){
			var engineiobroadcast=function(data){
				//console.log('test?');
				for(var eid in engineio.clients) {
					//console.log(engineio.clients[eid]);
					engineio.clients[eid].send(data);
				}
			}
			//console.log('setup function?');
			pce.engineio_boardcast(engineiobroadcast);
		}
	}
}

//===============================================
// route
//===============================================

module.exports.setroute = function(routes,app){
	//console.log('Base Module ');
	//add current dir plugin public folder
	app.use(express.static(__dirname + '/public'));
	//add current dir plugin views folder
	//app.set('views',path.join(__dirname,'/views'));

	//routes.get('/basemodule', function (req, res) {
		//res.contentType('text/html');
		//res.send('Hello World!'); //write string data page
		//res.render('test',{}); //render file .ejs
	//});
};

//===============================================
// Socket.io
//===============================================
module.exports.socketio_connect = function(io, socket){
	socket.on('Latency', function () {
		socket.emit('Latency');
	});

};
module.exports.socketio_disconnect = function(io, socket){
};

//===============================================
// Engine.io
//===============================================
module.exports.engineio_connect = function(engineio,socket){
	console.log('playcanvas-engine plugin!');
	//setup function
};
module.exports.engineio_message = function(data,socket){
	if(data == 'Latency'){
		socket.send('Latency');
	}
};
module.exports.engineio_close = function(socket){

};
