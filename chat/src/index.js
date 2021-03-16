const express = require('express');
const socket = require('socket.io');
const path = require('path');

const port = 8080;

const app = express();

app.use(express.static(path.join(path.dirname(__dirname), 'static')));

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`chat app listening on http://localhost:${port}/ ...`);
});

const io = socket(server);

const users = [];

io.on('connection', (socket) => {
  console.log('new connection');
  let localUser;

  socket.on('user', (user) => {
    console.log('new user:', user);
    localUser = user;
    users.push({
      user,
      socket,
    });
    console.log(
      'connected users:',
      users.map((user) => user.user)
    );
  });

  socket.on('message', (message) => {
    console.log(`${localUser.name} said: ${message.message}`);
    users.forEach((user) =>
      user.socket.emit('message', {
        user: localUser,
        message,
      })
    );
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', localUser);
    const index = users.findIndex((user) => user.user === localUser);
    if (index !== -1) {
      users.splice(index, 1);
    }
    console.log(
      'connected users:',
      users.map((user) => user.user)
    );
  });
});
