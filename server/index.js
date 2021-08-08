const express = require('express');
const app = express();
const http = require('http');
const readline = require('readline');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
 // res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  //console.log('a user connected');
  //socket.join('room');
  //io.to('room').emit('LEZ GOO');
    
  socket.on("getRooms", (callback) => {
    
    io.emit("message",socket.rooms);
    console.log(socket.rooms);
    //io.to(arg1.roomID).emit("message","toggle");

    callback({
      status: "ok"
    });

  });


  socket.on("joinRoom", (arg1,callback) => {
    //socket.leave();

    io.sockets.adapter.rooms.forEach(element => {
        socket.leave(element);
        
    });

    socket.join(arg1.roomID);
   // console.log("user joined room: " + arg1.roomID);
    
    callback({
      status: "ok"
    });
  });

  socket.on("isRecording", (arg1,callback) => {
    console.log("ask if is recording");
    io.to(arg1.roomID).emit("askRecording");
    
    callback({
      status: "ok"
    });
  });

  socket.on("answerRecording", (arg1) => {
    console.log("got answer if recording");
    io.to(arg1.roomID).emit("isRecordingAnswer");
    
   /* callback({
      status: "ok",
    });*/
  });

  socket.on("stopRecording", (arg1,callback) => {
    console.log("stopped recording @room:" + arg1.roomID);
    io.to(arg1.roomID).emit("stopRecordingSound");
  
    callback({
      status: "ok"
    });
  });

  socket.on("startRecording", (arg1,callback) => {
   // socket.to(arg1.roomID).emit("startRecordingSound");
   console.log("started recording @room:" + arg1.roomID);
   io.to(arg1.roomID).emit("startRecordingSound");
    callback({
      status: "ok"
    });
  });

  socket.on("newRoom", (arg1,callback) => {
    console.log(arg1); // 1
    console.log(arg1.roomID);
    if(!io.sockets.adapter.rooms[arg1.roomID])
    {
        console.log("user created new room" + arg1.roomID);
        socket.join(arg1.roomID);
      //  io.to(arg1.roomID).emit("stopRecording");
    }
    callback({
      status: "ok"
    });
  });


});


server.listen(3000, () => {
  console.log('listening on *:3000');
});