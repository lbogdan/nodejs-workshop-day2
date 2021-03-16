/* global io */

let socket;

const connectBtn = document.getElementById('connect');
const nameEdit = document.getElementById('name');
const sendBtn = document.getElementById('send');
const messageEdit = document.getElementById('message');
const messagesArea = document.getElementById('messages');

function addMessage(msg) {
  messagesArea.value += msg + '\n';
}

connectBtn.addEventListener('click', () => {
  socket = new io();
  socket.on('connect', () => {
    connectBtn.disabled = true;
    sendBtn.disabled = false;
    messageEdit.disabled = false;
    socket.emit('user', { name: nameEdit.value });
  });

  socket.on('message', (message) => {
    console.log('received message:', message);
    addMessage(`${message.user.name}: ${message.message.message}`);
  });
});

sendBtn.addEventListener('click', () => {
  socket.emit('message', { message: messageEdit.value });
  messageEdit.value = '';
});
