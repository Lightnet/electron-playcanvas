'use strict';

var Menu = require('menu');
var Tray = require('tray');

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
var win;
var appIcon = null;
//server express
var server = require('./server.js');

//setTimeout(function(){
//r.db('test').tableCreate('authors').run(connection, function(err, result) {
    //if (err) throw err;
    //console.log(JSON.stringify(result, null, 2));
//});
//},1000);

function createWindow () {
	console.log("createWindow?");

	//create server playcanvas
	//stand alone game

	appIcon = new Tray( __dirname + './public/favicon.ico');
	var contextMenu = Menu.buildFromTemplate([
		//{ label: 'Start Up', click: function() { console.log('item 1 clicked'); } },
		//{ label: 'Settings',  click: function() { console.log('item 2 clicked'); }},
		//{ label: 'Server', click: function() { console.log('item 3 clicked'); } },
		//{ label: 'Database', click: function() { console.log('item 4 clicked'); }},
		{ label: 'PlayCanvas', click: function() { console.log('item 4 clicked'); }},
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

	/*
	var contextMenu = Menu.buildFromTemplate([
    	{ label: 'Item1', click: function() { console.log('item 1 clicked'); } },
    	{ label: 'Item2',  click: function() { console.log('item 2 clicked'); }},
    	{ label: 'Item3', click: function() { console.log('item 3 clicked'); } },
    	{ label: 'Item4', click: function() { console.log('item 4 clicked'); }},
  	]);
	*/

	//var win = new BrowserWindow({width: 800, height: 1500,show:false});
	/*
	win = new BrowserWindow({width: 800, height: 600});
	win.loadURL('file://' + __dirname + '/index.html');
	var webContents = win.webContents;
	webContents.openDevTools();
	webContents.on("did-finish-load", function() {
		//console.log("Write PDF successfully.");
		console.log(win);
		console.log("hidden");
	});
	*/
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
