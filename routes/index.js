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
router.get('/', isAuthenticated, async (req, res, next) => {  
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectID(req.session.user) });
    const userObjects = user.matches.filter(item => item).map(item => { return new ObjectID(item) });
    const matchList = await db.collection('users').find({
      '_id': {
        '$in': userObjects
      }
    }).toArray();
    res.render('index', { matches: matchList, user });
  } catch(err) {
    console.error(err);
  }
});

// Push id of the liked person to the likedPersons[] of the user
router.post('/like', async (req, res, next) => {
  try {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.session.user) });

    // Check if the person is already liked, this means remove the like.
    if (user.likedPersons.includes(slug(req.body.id))) {
      try {
        const chats = await db.collection('chats').find().toArray();
        const openChats = chats.filter(chat => {
          return chat.users.includes(user._id.toString()) && chat.users.includes(slug(req.body.id).toString());
        });
        await db.collection('users').updateOne({ _id: ObjectID(req.session.user) }, { $pull: { 'likedPersons': slug(req.body.id) } });
        if (openChats.length > 0) {
          openChats.forEach(chat => removeChat(chat));
        }

        res.sendStatus(201);
        console.log('Disliked.');
      } catch(err) {
        console.error(err);
      }
    } else {
      // See if the other user already liked this user too
      checkMatch(req.session.user, req.body.id);
      // Add the liked user to the likedPersons array
      await db.collection('users').updateOne(
        { _id: ObjectID(req.session.user) },
        { $push: { "likedPersons": slug(req.body.id) } }
      )
      console.log('Liked');
      res.sendStatus(200);
    }
  } catch(err) {
    console.error(err);
  }
});

// Render chats
router.get('/chats', isAuthenticated, async (req, res, next) => {
  try {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.session.user) });
    const chatList = [];
    user.chats.forEach((chat, err) => {
      if(err) {
        console.error(err);
      }
      chatList.push(db.collection('chats').findOne({ _id: chat }));
    });
    allChats = await Promise.all(chatList);
    if (allChats.length > 0) {
      for (let i =0; i < allChats.length;i++) {
        const userList = [];
        allChats[i].users.forEach(user => {
          userList.push(db.collection('users').findOne({ _id: new ObjectID(user) }))
        });
        allChats[i].users = await Promise.all(userList);
      }
    } else {
      allChats = [];
    }
    res.render('chats', { chats: allChats, user });

  } catch(err) {
    console.error(err);
  }
});

// Render individual chat based on the chat id
router.get('/chat/:id', isAuthenticated, async (req, res, next) => {
  try {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.session.user) });
    const id = parseInt(req.params.id);
    const chat = await db.collection('chats').findOne({ _id: id });
    res.render('chat', { users: chat.users, messages: chat.messages, user });
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
  // Setting the session user to the selected user on login
  req.session.user = slug(req.body.user);
  res.redirect('/');
});

// Post route for logging out
router.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/login');
});

// Check if a user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user != undefined) return next();
  res.redirect('/login');
}

// Function checks if both users liked each other
async function checkMatch(userId, likedUserId) {
  try {
    const likedUser = await db.collection('users').findOne({ _id: ObjectID(likedUserId) })
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

// Removes a chat from the chats collection and from the array of chats for the users that are in the chat
async function removeChat(chat) {
  try {
    const users = chat.users;
    // Delete the chat
    await db.collection('chats').deleteOne({ _id: chat._id });
    // Delete chat for the users
    users.forEach(async (user) => {
      await db.collection('users').updateOne({ _id: ObjectID(user) }, { $pull: { 'chats': chat._id } });
    })
  } catch(err) {
    console.error(err);
  }
}

module.exports = router;