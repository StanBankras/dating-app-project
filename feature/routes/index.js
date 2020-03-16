const express = require('express');
const router = express.Router();
const slug = require('slug');
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;
// Use database connection from server.js
const dbCallback = require('../server.js').db;
let db;
dbCallback(database => {
  db = database
});

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

// Render homepage with matches of the logged in user
router.get('/', async (req, res, next) => {  
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectID(req.session.user) });
    const userObjects = user.matches.filter(item => item).map(item => { return new ObjectID(item) });
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

// To do
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

// Render individual chat based on the chat id
router.get('/chat/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const chat = await db.collection('chats').findOne({ _id: id });
    res.render('chat', { users: chat.users, messages: chat.messages });
  } catch(err) {
    console.error(err);
  }
});

// Load users that are able to login
router.get('/login', async (req, res, next) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.render('login', { users: users });
  } catch(err) {
    console.error(err);
  }
});

// Post route for login
router.post('/login-as', (req, res, next) => {
  req.session.user = req.body.user;
  res.redirect('/');
});

// Post route for logging out
router.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/login');
});

// Function checks if both users liked each other
async function checkMatch(userId, likedUserId) {
  try {
    const likedUser = db.collection('users').findOne({ _id: ObjectID(likedUserId) })
    if (likedUser.likedPersons.includes(userId)) {
      createChat(userId, likedUserId);
      console.log('It is a match!');
    }
  } catch(err) {
    console.error(err);
  }
}

// Creates a new chat in the database and links it to two users
async function createChat(id, otherId) {
  try {
    const chats = await db.collection('chats').find().count();
    await db.collection('chats').insertOne({
      _id: chats, users: [id, otherId], messages: []
    });
    await db.collection('users').updateOne(
      { _id: ObjectID(id) },
      { $push: { "chats": chats } }
    )
    await db.collection('users').updateOne(
      { _id: ObjectID(otherId) },
      { $push: { "chats": chats } }
    )
  } catch(err) {
    console.error(err);
  }
}

module.exports = router;
