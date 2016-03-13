# electron-playcanvas
 Created by: Lightnet

 ## License [CC0 (Public Domain)](LICENSE.md)

 Development Status: Early Stage.

 Information: Using the Electron to have PlayCanvas to run stand alone application.

 Features:
  * Development for web game builds.
  * Run the server express.
  * Run Rethinkdb for real time database.
  * Socket.io for chat message
  * Engine.io for server side game object and message.
  *

 Notes:
  * Not recommend for hosting that is under development.
  * var engineio = eio(); //bug using the IPv6 using http://[[ipadress]] <- wrong instead http://[ipadress]

 nodejs packages:
  * rethinkdb
  *


//http://localhost:8080/ rethinkdb

window:
```
cmd

"./node_modules/electron-prebuilt/dist/electron.exe" "./"
```

window shortcut:
```
'<drive>:\node_modules\electron-prebuilt\dist\electron.exe' "../../../"

```
