var socketiobroadcast;
exports.socketio_boardcast=function(obj){
	socketiobroadcast = obj;
};
var engineiobroadcast;
exports.engineio_boardcast=function(obj){
	engineiobroadcast = obj;
};

module.exports.socketio_connect = function(io, socket){

};

module.exports.socketio_disconnect = function(io, socket){

};


module.exports.engineio_connect = function(engineio,socket){

};
module.exports.engineio_message = function(data,socket){

};
module.exports.engineio_close = function(socket){
	
};
