const path = require("path");
const http = require("http"); 
const express = require('express');
const socketIO = require('socket.io');
const { generateTextMessage, generateLocationMessage } = require('../template/message');
const {Users} = require('./Users')
const users = new Users()
const app = express(); 
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname + "/../public");
app.use(express.static(publicPath))


io.on("connection", (socket) => {
  console.log("New user connect to server")

  socket.on("joinroom", (userObj) => {
    const { name, room } = userObj
    socket.join(room)

    const newUser ={
      id: socket.id,
      name,room
    }

    users.addUser(newUser)
    console.log(users.getListOfUserInRoom(room))

    io.to(room).emit("listUser",{listUser: users.getListOfUserInRoom(room)})

    socket.emit("sendMsg", generateTextMessage("admin", "Welcome to the chat app"))

    socket.broadcast.to(room).emit("sendMsg", generateTextMessage("admin", `${name} user joined`))


    socket.on("createMsg", (msg) => {
      io.to(room).emit("sendMsg", generateTextMessage(msg.from, msg.text))
    })

    socket.on("createLocation", (msg) => {
      io.to(room).emit("sendLocation", generateLocationMessage(msg.from, msg.latitude, msg.longitude))
    })
    socket.on("disconnect", () => {
      users.removeUserId(socket.id)
      socket.broadcast.to(room).emit("sendMsg", generateTextMessage("Admin", `${name} left the room`))
      io.to(room).emit("listUser",{listUser: users.getListOfUserInRoom(room)})
    })
  })


})

 
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})