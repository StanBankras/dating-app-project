const server = require('./server.js').server;
const io = require('socket.io')(server);
const dateFormat = require('dateformat');
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;
// Use database connection from server.js
const dbCallback = require('./server.js').db;
let db;
dbCallback(database => {
  db = database
});

dateFormat.masks.chatFormat = 'HH:MM - dd/mm';

io.on('connection', (socket) => {
  socket.username = "Anonymous";

  socket.on('new_message', async (data) => {
    try {
      if (data.message == '') return;
      await db.collection('chats').updateOne({ 'chatNumber': parseInt(data.chatId) }, {
        $push: { messages: {
          message: data.message,
          userId: data.userId,
          date: dateFormat(data.date, 'chatFormat')
        } }
      });

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