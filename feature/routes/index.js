const express = require('express');
const router = express.Router();
const slug = require('slug');
const fs = require('file-system');
const multer  = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const mongo = require('mongodb');
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

// Mongo setup code, obtained from the Full Driver Sample provided by MongoDB
let db = null;
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(() => {
  db = client.db(process.env.DB_NAME);
});

// Render homepage with matches of the logged in user
router.get('/', async (req, res, next) => {  
  try {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.session.user) });
    const userObjects = user.matches.map(item => { return new ObjectID(item) });
    const matchList = await db.collection('users').find({
      '_id': {
        '$in': userObjects
      }
    }).toArray();
    res.render('index', { matches: matchList });
  } catch(err) {
    console.error(err);
  }
});

// Push id of the liked person to the likedPersons[] of the user
router.post('/like', async (req, res, next) => {
  try {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.session.user) });

    // Check if the person is already liked
    if (user.likedPersons.includes(req.body.id)) {
      console.log('Person already liked.');        
    } else {
      // See if the other user already liked this user too
      checkMatch(req.session.user, req.body.id);
      // Add the liked user to the likedPersons array
      await db.collection('users').updateOne(
        { _id: ObjectID(req.session.user) },
        { $push: { "likedPersons": req.body.id } }
      )
      console.log('Updated');
      res.sendStatus(200);
    }
  } catch(err) {
    console.error(err);
  }
});

router.post('/dislike', (req, res, next) => {
  console.log(req.body.id, 'disliked!');
  res.sendStatus(200);
});

// Render chats
router.get('/chats', async (req, res, next) => {
  try {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.session.user) });
    const chatList = [];
    user.chats.forEach((chat, err) => {
      if(err) {
        console.error(err);
      }
      chatList.push(db.collection('chats').findOne({ _id: chat }));
    });
    data = await Promise.all(chatList)
    res.render('chats', { chats: data });

  } catch(err) {
    console.error(err);
  }
});

// Render chat
router.get('/chat', (req, res, next) => {
  res.render('chat', { });
});

router.get('/login', async (req, res, next) => {
  try {
    let users = await db.collection('users').find().toArray();
    res.render('login', { users });
  } catch(err) {
    console.error(err);
  }
});

router.post('/login-as', (req, res, next) => {
  req.session.user = req.body.user;
  res.redirect('/');
});

router.post('/logout', (req, res, next) => {
  req.session.user = '';
  res.redirect('/login');
});

async function checkMatch(userId, likedUserId) {
  try {
    const likedUser = await db.collection('users').findOne({ _id: ObjectID(likedUserId) });
    if (likedUser.likedPersons.includes(userId)) {
      const chats = await db.collection('chats').find().count();
      console.log(chats);
      await db.collection('chats').insertOne({
        _id: chats, users: [userId, likedUserId], messages: []
      });
      await db.collection('users').updateOne(
        { _id: ObjectID(userId) },
        { $push: { "chats": chats } }
      )
      await db.collection('users').updateOne(
        { _id: ObjectID(likedUserId) },
        { $push: { "chats": chats } }
      )
      console.log('It is a match!');
    }
  } catch(err) {
    console.error(err);
  }
}

module.exports = router;
