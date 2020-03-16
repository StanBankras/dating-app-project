const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const slug = require('slug');
const fs = require('file-system');
const multer  = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const ObjectID = mongo.ObjectID;

// Edit slug so it doesn't replace spaces with '-';
slug.defaults.mode ='pretty';
slug.defaults.modes['pretty'] = {
  replacement: ' ',
  symbols: true,
  remove: /[.]/g,
  lower: false,
  charmap: slug.charmap,
  multicharmap: slug.multicharmap
};

// Load environment variables
require('dotenv').config();

// Mongo setup code, get necessary collection back in let matches.
let db = null;
let matches = '';
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(() => {
  db = client.db(process.env.DB_NAME);
});

// Render homepage with matches
router.get('/', async (req, res, next) => {  
  await db.collection('users').find().toArray((err, data) => { 
    if (err) return console.error(err);
    matches = data; 
    res.render('index', { matches: matches });
  });
});

router.post('/match', (req, res, next) => {
  console.log(req.body.id);
  res.sendStatus(200);
});

// Render chats
router.get('/chats', (req, res, next) => {
  res.render('chats', { });
});

// Render chat
router.get('/chat', (req, res, next) => {
  res.render('chat', { });
});

module.exports = router;
