const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

userNameSpace = io.of('/user')
userNameSpace.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.user_id = socket.id;

  socket.on("join_room", (data) => {
    socket.join(data.room);
    userNameSpace.in(data.room).emit('send_message');
    console.log(`User with ID: ${socket.user_id} joined room: ${data.room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log('msg:', data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.user_id);
  });
});

server.listen(3001, () => {
  console.log("Server Running on port 3001");
});
