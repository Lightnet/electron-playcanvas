'use strict';

var Menu = require('menu');
var Tray = require('tray');

const electron = require('electron');
// Module to control application life.
const app = electron.app;
const ipcMain = electron.ipcMain;
const ipcRenderer = require('electron').ipcRenderer;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
var databaseWindow;
var serverWindow;
var clientWindow;
var gameWindow;
var settingsWindow;
var appIcon = null;
//server express
var server = require('./server.js');

function buildwindow(url,options){
	var _Window = new BrowserWindow(options);
	_Window.loadURL(url);
	var webContents = _Window.webContents;
	webContents.openDevTools();
	webContents.on("did-finish-load", function(){});
	return _Window;
}

function displaywindowid(windowid){
	if(windowid == 'game'){
		if(gameWindow != null){
			try{
				gameWindow.show();
			}catch(e){
				gameWindow = null;
				gameWindow = buildwindow('http://localhost/',{width: 800, height: 600});
			}
		}else{
			gameWindow = buildwindow('http://localhost/',{width: 800, height: 600});
		}
	}
	if(windowid == 'server'){
		if(serverWindow != null){
			try{
				serverWindow.show();
			}catch(e){
				serverWindow = null;
				serverWindow = buildwindow('file://' + __dirname + '/playcanvas-server.html',{width: 800, height: 600});
			}

		}else{
			serverWindow = buildwindow('file://' + __dirname + '/playcanvas-server.html',{width: 800, height: 600});
		}
	}
	if(windowid == 'client'){
		if(clientWindow != null){
			try{
				clientWindow.show();
			}catch(e){
				clientWindow = null;
				clientWindow = buildwindow('http://localhost/'+'client.html',{width: 800, height: 600});
			}

		}else{
			clientWindow = buildwindow('http://localhost/'+'client.html',{width: 800, height: 600});
		}
	}
	if(windowid == 'database'){
		if(databaseWindow != null){
			try{
				databaseWindow.show();
			}catch(e){
				databaseWindow = null;
				databaseWindow = buildwindow('http://localhost:8080/',{width: 800, height: 600});
			}
		}else{
			databaseWindow = buildwindow('http://localhost:8080/',{width: 800, height: 600});
		}
	}

	if(windowid == 'settings'){
		if(settingsWindow != null){
			try{
				settingsWindow.show();
			}catch(e){
				settingsWindow = null;
				settingsWindow = buildwindow('file://' + __dirname + '/settings.html',{width: 800, height: 600});
			}
		}else{
			settingsWindow = buildwindow('file://' + __dirname + '/settings.html',{width: 800, height: 600});
		}
	}
}

function createWindow () {
	console.log("createWindow?");
	//create server playcanvas
	//stand alone game
	appIcon = new Tray( __dirname + './public/favicon.ico');

	var contextMenu = Menu.buildFromTemplate([
		//{ label: 'Start Up Window', click: function() {ipcRenderer.send('start-up', 't' ); console.log('start-up');}},
		{ label: 'Database', click: function() { displaywindowid('database'); console.log('item database'); }},
		{ label: 'Server', click: function() {displaywindowid('server');  console.log('item server'); }},
		{ label: 'Client', click: function() {displaywindowid('client'); console.log('item client'); }},
		{ label: 'Game', click: function() { displaywindowid('game'); console.log('item game'); }},
		{ label: 'Settings',  click: function() { displaywindowid('settings'); console.log('item settings');}}
	]);

	appIcon.setToolTip('This is my application.');
	appIcon.setContextMenu(contextMenu);
	appIcon.on('clicked',function(event){
		//console.log(event);
		//console.log('click');
		if(mainWindow !=null){
			console.log(mainWindow);
			if(mainWindow.isVisible()){
				mainWindow.hide();
			}else{
				mainWindow.show();
			}
		}
	});

	ipcMain.on('window-display', function(event, windowid) {
  		console.log('windowid:'+windowid);
		displaywindowid(windowid);
	});

	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600});
	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	//mainWindow.loadURL('http://127.0.0.1:3000/');
	var webContents = mainWindow.webContents;
	webContents.on("did-finish-load", function() {
		//console.log("Write PDF successfully.");
		//console.log(mainWindow);
	});
	//console.log("hello world");
	// Open the DevTools.
	mainWindow.webContents.openDevTools();
	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  console.log("activate?");
  if (mainWindow === null) {
    createWindow();
  }
});
