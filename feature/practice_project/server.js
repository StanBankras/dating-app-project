/**
 * Module dependencies.
 */

var app = require('./app');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
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