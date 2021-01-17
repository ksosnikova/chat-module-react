const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*'
  }
});

io.on('connect', (socket) => {
  console.log('We have a new connection!');

  socket.on('join', ({ name, room }, cb) => {
    const { error, user } = addUser({id: socket.id, name, room});

    if (error) return cb(error);

    socket.join(user.room);

    socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`});

    cb();
  })

  socket.on('sendMessage', (message, cb) => {
    const user = getUser(socket.id);
    //console.log('user', user)
    io.to(user.room).emit('message', { user: user.name, text: message });

    cb();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.name).emit('message', { user: 'admin', text: `${user.name} has left.`})
    }
  })
})

app.use(router);

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
});