const server = require('./server.js').server;
const io = require('socket.io')(server);
const dateFormat = require('dateformat');

dateFormat.masks.chatFormat = 'HH:MM - dd/mm';

io.on('connection', (socket) => {
  console.log('New client connected.');
  socket.username = "Anonymous";

  socket.on('new_message', async (data) => {
    try {
      console.log(data);
      io.sockets.emit('new_message', { 
        message: data.message, 
        username: data.username,
        date: dateFormat(data.date, 'chatFormat')
      });
    } catch(err) {
      console.error(err);
    }
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: data.username });
  });
});