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

io.on('connection', (socket) => {
  // implement
});
