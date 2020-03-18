const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const mongo = require('mongodb');

// Load environment variables
require('dotenv').config();

// Mongo setup code, obtained from the Full Driver Sample provided by MongoDB
let db = null;
let callback;
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
const port = 3000;
const server = http.createServer(app);

// Establish connection to MongoDB database
client.connect(() => {
  db = client.db(process.env.DB_NAME);
  if (callback) callback(db);
  server.listen(port);
  server.on('listening', () => console.log('Listening on port ' + port));
});

// Received help from Alex Bankras (Software engineer) to be able to export my database connection & server
// module.exports is placed here because the indexRouter also needs the callback function
module.exports = {
    db: function(cb) {
        if(db) {
            cb(db)
        } else {
            callback = cb
        }
    },
    server // Exporting for use in websockets.js
}

// Import routes from external file
const indexRouter = require('./routes/index');
require('./websockets.js');

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Source: https://www.npmjs.com/package/express-session
app.use(session({ 
    resave: false,
    saveUninitialized: true,
    secure: true,
    secret: process.env.SESSION_SECRET
}));
app.use('/', indexRouter); // Routing in separate file

// 404 page route
app.use(function(req,res){
    res.status(404).render('404.ejs');
});