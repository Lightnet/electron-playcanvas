/*
    PlayCanvas Physics headless nodejs server

    Information: To create a simple playcanvas headless server nodejs.

    Notes:
     * ammo.js loading more modules might crashes or fail to load correctly.

*/

//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var _http = require('http');
var path = require('path');
var fs = require('fs');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var engine = require('engine.io');
var engineio = new engine.Server({'transports': ['websocket', 'polling']});

var r = require('rethinkdb');
var connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
	console.log('connect?');
});
/*
setTimeout(function(){
	try{
		r.db('test').tableCreate('socketio').run(connection, function(err, result) {
		    //if (err) throw err;
		    //console.log(JSON.stringify(result, null, 2));
		});

		r.db('test').tableCreate('engineio').run(connection, function(err, result) {
		    //if (err) throw err;
		    //console.log(JSON.stringify(result, null, 2));
		});

		r.db('test').tableCreate('account').run(connection, function(err, result) {
		    //if (err) throw err;
		    //console.log(JSON.stringify(result, null, 2));
		});
	}catch(e){
		console.log(e)
	}
},2000);
*/
// 0 = socket.io
// 1 = engine.io
OBJIONetworkType = 1;
//
bConfigPlayCanvas = true;

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = _http.createServer(router);
engineio.attach(server);
var io = socketio.listen(server);

//router.use(function(req, res, next){
    //res.header("Content-Security-Policy", "default-src 'self';script-src 'self';object-src 'none';img-src 'self';media-src 'self';frame-src 'none';font-src 'self' data:;connect-src 'self';style-src 'self'");
    //next();
//});

//client folder for public access for host web broswer files
router.use(express.static(path.resolve(__dirname, 'public')));
//load file to write url file js
var eio_contents = fs.readFileSync(__dirname + '/node_modules/engine.io-client/engine.io.js').toString();
router.get('/engine.io.js', function(req, res) {
	//res.setHeader("Access-Control-Allow-Origin", "*");
	res.send(eio_contents);
});
//=========================================================
// socket.io
//=========================================================
var messages = [];
var sockets = [];
//io.set('log level', 1); // reduce logging
io.on('connection', function (socket) {
	console.log("socket.io user connected!");
	console.log(socket.id);
    messages.forEach(function (data) {
		socket.emit('message', data);
    });

    sockets.push(socket);
	//send back the ping message for transport time
	socket.on('Latency', function () {
		socket.emit('Latency');
	});

    socket.on('disconnect', function () {
		sockets.splice(sockets.indexOf(socket), 1);
		//updateRoster();
		console.log("socket.io user disconnect!");
		rethinkdb_socketio_remove(socket);
    });
    socket.on('message', function (msg) {
		var text = String(msg || '');
		if (!text)
			return;
		//socket.get('name', function (err, name) {
			//var data = {
				//name: name,
				//text: text
			//};
			//broadcast('message', data);
			//messages.push(data);
		//});
	});

    socket.on('identify', function (name) {
		//console.log('name:'+name);
		var name = String(name || 'Anonymous');
		//socket.set('name', String(name || 'Anonymous'), function (err) {
			//updateRoster();

			//console.log(socket.id);
			//socket.name = String(name || 'Anonymous');
		//});

		r.table('socketio').insert([
			{ 	id: socket.id,
				name: name,
				idname:socket.id
			}
		]).run(connection, function(err, result) {
			if (err){
				//console.log(err);
				return;
			}
			socket.emit('identify',name);
			//console.log("socket.io add id!");
			//console.log(JSON.stringify(result, null, 2));
		})
	});
});

//delete id user name
function rethinkdb_socketio_remove(socket){
	r.table('socketio').
    filter(r.row('id').eq(socket.id)).
    delete().
    run(connection, function(err, result) {
        if (err){
			console.log(err);
			//throw err;
		}
        //console.log(JSON.stringify(result, null, 2));
    });
}

function updateRoster() {
	console.log('updateRoster');
	async.map(
		sockets,
		function (socket, callback) {
			//socket.get('name', callback);
			//console.log("sockets?>> map");
			//callback(socket.name);
			r.table('socketio').filter(r.row('id').eq(socket.id)).
		    run(connection, function(err, cursor) {
				//console.log("get socket id ?");
		        if (err)console.log(err);
		        cursor.toArray(function(err, result) {
		            if (err){
						console.log(err);
						return;
					}
					//console.log("get socket.io name??");

					var user = JSON.stringify(result, null, 2);
		            //console.log(user[0]['id']);
					//console.log(user);
					//console.log(result[0]['name']);
					if(result.length > 0){
						//console.log('name:' + result[0]['name']);
						callback(result[0]['name']);
					}else{
						//console.log(JSON.stringify(result, null, 2));
						callback(null);
					}
		        });
		    });
		},
		function (err, names) {
			broadcast('roster', names);
		}
	);
}

function broadcast(event, data) {
	sockets.forEach(function (socket) {
		socket.emit(event, data);
	});
}

//=========================================================
// engine.io
//=========================================================

//console.log(engineio);
engineio.on('connection', function (socket) {
	console.log("engine.io user connected.");
	console.log(socket.id);
    //console.log(engineio);
    //console.log(engineio.clients);
    //for(eid in engineio.clients) {
        //console.log(engineio.clients[eid]);
        //engineio.clients[eid].send('test');
        //console.log(variable);
    //}
    //console.log(socket);

    //socket.send('ping');
    //socket.send("{test:'test'}"); //send out as string
    socket.on('message', function(data){
		if(data != 'Latency'){
			console.log(data);
		}
		if(data == 'Latency'){
            socket.send('Latency');
        }
    });
    socket.on('close', function(){
        console.log("engine.io user close.");
    });
    //socket.send('utf 8 string');
    //socket.send(new Buffer([0, 1, 2, 3, 4, 5])); // binary data
    //console.log(new Buffer([0, 1, 2, 3, 4, 5]));
    //socket.send(new test()); // binary data
});

//create send clients
function engineiobroadcast(data){
    for(eid in engineio.clients) {
        //console.log(engineio.clients[eid]);
        engineio.clients[eid].send(data);
    }
}

//=========================================================
// start listen express server
//=========================================================
function SetTime(){
	console.log(new Date().getTime());

	setTimeout(SetTime, 3000);
}

server.listen(process.env.PORT || 80, process.env.IP || "0.0.0.0", function(){
	var addr = server.address();
	try{
	setTimeout(function(){
		var pce = require('./playcanvas-engine.js');
		pce.socketio_boardcast(broadcast);
		pce.engineio_boardcast(engineiobroadcast);
	}, 1000);

	}catch(e){
		console.log("playcanvas-engine?");
		console.log(e);
	}
	console.log("PlayCanvas server listening at", addr.address + ":" + addr.port);
	//SetTime();
});
