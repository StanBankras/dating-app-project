const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const slug = require('slug');
const ObjectID = mongo.ObjectID;

// Load environment variables
require('dotenv').config();

// Mongo setup code, most directly from MongoDB Atlas documentation
let db = null;
let matches;
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  db = client.db(process.env.DB_NAME);
  db.collection('users').find().toArray(done)

  function done(err, data) {
    if (err) {
      console.log(uri + ' error');
      next(err)
    } else {
      matches = data;
      console.log(data);
    }
  }
});

// Render homepage with matches
router.get('/', (req, res, next) => {
  res.render('index', { matches: matches });
});

router.post('/match', (req, res, next) => {
  console.log('Test');
});

// Render chats
router.get('/chats', (req, res, next) => {
  res.render('chats', { });
});

// Render chat
router.get('/chat', (req, res, next) => {
  res.render('chat', { });
});

// Dynamic route with params
router.get('/profile/:id', (req, res, next) => {
  res.send('You requested to see a profile with the id of ' + req.params.id);
});

module.exports = router;
