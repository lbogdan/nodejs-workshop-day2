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
  // implement
});
