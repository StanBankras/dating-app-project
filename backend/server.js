var app = require('./app');
var http = require('http');

var port = 3000;
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "listening" event.
 * 
 * Credits: this code was generated by the NPM package 'express-generator'
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on port ' + port);
}


/**
 * Socket.io include
 */

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
 })