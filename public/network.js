//global access variables
var ball; //class ball function
var blocks; //array of bricks object
var wall;

var ProtoBuf = dcodeIO.ProtoBuf;
var ByteBuffer = dcodeIO.ByteBuffer;

var Message = ProtoBuf.loadProtoFile("/example.proto").build("Message");
var Sceneobject = ProtoBuf.loadProtoFile("/sceneobj.proto").build("Sceneobj");

function addListener(event, obj, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(event, fn, false);   // modern browsers
    } else {
        obj.attachEvent("on"+event, fn);          // older versions of IE
    }
}

var smoothie = new SmoothieChart();
// Data
var line1 = new TimeSeries();
var line2 = new TimeSeries();
// Add to SmoothieChart
smoothie.addTimeSeries(line1,{ strokeStyle:'rgb(0,0,255)', lineWidth:1 });
smoothie.addTimeSeries(line2,{ strokeStyle:'rgb(0, 255, 0)', lineWidth:1 });

//make sure this load right
addListener("load", window,function(){
    //smoothie.streamTo(document.getElementById("mycanvas"));
    smoothie.streamTo(document.getElementById("chartcanvas"), 1000 /*delay*/);
});

var siolast;
function send_Latency_sio(){
  siolast = new Date;
  socketio.emit('Latency');
  //document.getElementById('stransport').innerHTML = socketio.io.engine.transport.name;
  //document.getElementById('stransport').innerHTML = socketio.socket.transport.name;
}

//===============================================
// Socket.io
//===============================================
var socketio = io.connect();
socketio.emit('Latency');
socketio.on('Latency', function(){
	//console.log('socket.io Latency');
	var latency = new Date - siolast;
	document.getElementById('slatency').innerHTML = latency + 'ms';
	line2.append(+new Date, latency);
	setTimeout(send_Latency_sio, 100);
});
socketio.on('connect', function () {
	console.log("socket.io connect");
});
socketio.on('disconnect', function () {
	console.log("socket.io disconnect");
	//document.getElementById('stransport').innerHTML = '(disconnected)';
});

socketio.on('object', function (data) {
	//console.log('data');
	//console.log(data);
	try{
		var msg = Message.decode(data);
		//console.log("msg:" + msg.text);
	}catch(e){}
});

socketio.on('obj', function (msg) {
	var p;
	var r;
	var quat;
	//console.log(typeof msg);
	if(msg['type'] == 'ball'){
		if(typeof ball != 'undefined'){
			p = msg['p']; //position [x, y, z]
			r = msg['r']; //rotation [x, y, z, w]
			ball.entity.setPosition(p[0],p[1],p[2]);
			quat = new pc.Quat(r[0],r[1],r[2],r[3]);
			ball.entity.setRotation(quat);//warp/deform scale object
		}
	}

	if(msg['type'] == 'block'){
		if(typeof blocks != 'undefined'){
			p = msg['p'];
			r = msg['r'];
			blocks[msg['id']].setPosition(p[0],p[1],p[2]);
			quat = new pc.Quat(r[0],r[1],r[2],r[3]);
			blocks[msg['id']].setRotation(quat);
		}
	}
	p=null;
	r=null;
	quat=null;
});
//===============================================
//engine.io
//===============================================
var elast;
function send_Latency_eio(){
  elast = new Date;
  engineio.send('Latency');
  //document.getElementById('etransport').innerHTML = engineio.transport.name;
}
var engineio = eio('ws://localhost');
//var engineio = eio();
send_Latency_eio();
engineio.on('open', function(){
    //console.log("client web browser");
    //console.log(socket);
    engineio.send('pong');
    engineio.on('message', function(data){
        //console.log("-----");
        //console.log(typeof data);
        //console.log(data);
		//if(data == Message()){
			//console.log("found message");
		//}
		if(data == 'reset'){
			//console.log("found reset");
			if(wall != null){
				wall.reset();
			}
		}
		if(data == 'fire'){
			//console.log("found fire");
		}
		if(data == 'Latency'){
            var latency = new Date - elast;
            document.getElementById('elatency').innerHTML = latency + 'ms';
            //if (time) time.append(+new Date, latency);
            line1.append(+new Date, latency)
            setTimeout(send_Latency_eio, 100);
        }
		try{
			var msg = Message.decode(data);
			//console.log("msg:" + msg.text);
		}catch(e){}
		//console.log('test');
		try{
			var Sceneobj = Sceneobject.decode(data);
			//console.log(Sceneobj);
			if(Sceneobj.type == 'ball'){
				//console.log('ball?');
				//console.log(Sceneobj);
				if(typeof ball != 'undefined'){
					//ball.entity.setPosition(Sceneobj.px,Sceneobj.py,Sceneobj.pz);
					ball.position(new pc.Vec3(Sceneobj.px,Sceneobj.py,Sceneobj.pz));
					quat = new pc.Quat(Sceneobj.rx,Sceneobj.ry,Sceneobj.rz,Sceneobj.rw);
					//ball.entity.setRotation(quat);
					ball.entity.endRot = quat.clone();
					quat = null;
				}
			}

			if(Sceneobj.type == 'block'){
				//console.log('block?');
				if(typeof blocks != 'undefined'){
					//blocks[parseInt(Sceneobj.id)].setPosition(Sceneobj.px,Sceneobj.py,Sceneobj.pz);
					//blocks[parseInt(Sceneobj.id)].lpos(new pc.Vec3(Sceneobj.px,Sceneobj.py,Sceneobj.pz));
					var lpos = new pc.Vec3(Sceneobj.px,Sceneobj.py,Sceneobj.pz);
					blocks[parseInt(Sceneobj.id)].lpos(lpos);
					//if(Sceneobj.id == 0){}
					quat = new pc.Quat(Sceneobj.rx,Sceneobj.ry,Sceneobj.rz,Sceneobj.rw);
					blocks[parseInt(Sceneobj.id)].setRotation(quat);
					//blocks[parseInt(Sceneobj.id)].endRot = quat.clone();
					quat = null;
				}
			}

			Sceneobj = null;
			//console.log("msg:" + msg.text);
			//console.log('pass');
		}catch(e){
			//console.log('fail');
			//console.log('error:'+e);
		}
    });
    engineio.on('close', function(){
        console.log("engine.io user close");
    });
    console.log("engine.io user open!");
});
