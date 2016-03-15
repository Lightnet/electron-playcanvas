/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

//Note this base function current set to the plugin module setup
var express = require('express');
var plugin = require('../../app/libs/plugin.js');
var path = require('path');
/*global getModules */
//var io;
//var socket;
//var db;

//===============================================
// Config
//===============================================
module.exports._config = require('./index.json');
//===============================================
// Init Post
//===============================================
module.exports.initpost = function(){
	console.log('init post');
}
//===============================================
// Session
//===============================================
/*
module.exports.setBeforeSession = function(app,session,config){
  //console.log('Base Module ');
}
module.exports.setSession = function(app,session,config){
  //console.log('Base Module ');
}
module.exports.setAfterSession = function(app,session,config){
  //console.log('Base Module ');
}
*/
//===============================================
// route
//===============================================

module.exports.setroute = function(routes,app){
	//console.log('Base Module ');
	//add current dir plugin public folder
	app.use(express.static(__dirname + '/public'));
	//add current dir plugin views folder
	app.set('views',path.join(__dirname,'/views'));

	routes.get('/basemodule', function (req, res) {
		res.contentType('text/html');
		//res.send('Hello World!');
		res.render('test',{});
	});
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

};
module.exports.engineio_message = function(data,socket){
	if(data == 'Latency'){
		socket.send('Latency');
	}
};
module.exports.engineio_close = function(socket){

};
