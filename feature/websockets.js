const server = require('./server.js');
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('New client connected.');
  socket.username = "Anonymous";

  socket.on('new_message', (data) => {
    io.sockets.emit('new_message', { 
      message: data.message, 
      username: socket.username 
    });
  });

  socket.on('change_username', (data) => {
    socket.username = data.username;
  });

  socket.on('typing', (data) => {
  socket.broadcast.emit('typing', { username: socket.username });
  });
});