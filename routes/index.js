const express = require('express');
const router = express.Router();
const slug = require('slug');
const dateFormat = require('dateformat');
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;
// Use database connection from server.js
const dbCallback = require('../server.js').db;
let db;
dbCallback(database => {
  db = database
});

dateFormat.masks.chatFormat = 'HH:MM - dd/mm';

// Edit slug so it doesn't replace spaces with '-' -- https://www.npmjs.com/package/slugify
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
        if (!req.body.js) {
          return res.redirect('/');
        }
        return res.sendStatus(201);
      } catch(err) {
        console.error(err);
      }
    } else {
      // See if the other user already liked this user too
      checkMatch(req.session.user, req.body.id, res);
      // Add the liked user to the likedPersons array
      await db.collection('users').updateOne(
        { _id: ObjectID(req.session.user) },
        { $push: { "likedPersons": slug(req.body.id) } }
      )
      if (!req.body.js) {
        return res.redirect('/');
      }
      return res.sendStatus(200);
    }
  } catch(err) {
    console.error(err);
  }
});

router.get('/match', (req, res, next) => {
  res.render('match', {});
})

// Render chats
router.get('/chats', isAuthenticated, async (req, res, next) => {
  try {
    const user = await db.collection('users').findOne({ _id: ObjectID(req.session.user) });
    const chatList = [];
    user.chats.forEach((chat, err) => {
      if(err) {
        console.error(err);
      }
      chatList.push(db.collection('chats').findOne({ chatNumber: chat }));
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
    const chat = await db.collection('chats').findOne({ chatNumber: id });
    const otherUserId = chat.users[0] == user._id ? chat.users[1] : chat.users[0];
    const otherUser = await db.collection('users').findOne({  _id: ObjectID(otherUserId) });
    res.render('chat', { users: chat.users, messages: chat.messages, user, id, otherUser });
  } catch(err) {
    console.error(err);
  }
});

router.post('/message', async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const chatId = req.body.chatId;
    const message = req.body.message;
    await db.collection('chats').updateOne({ 'chatNumber': parseInt(chatId) }, {
      $push: { messages: {
        message: message,
        userId: userId,
        date: dateFormat(new Date, 'chatFormat')
      } }
    });
    res.redirect('/chat/' + chatId);
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

// Check if a user is logged in -- source: https://scotch.io/tutorials/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
function isAuthenticated(req, res, next) {
  if (req.session.user != undefined) return next();
  res.redirect('/login');
}

// Function checks if both users liked each other
async function checkMatch(userId, likedUserId, res) {
  try {
    const likedUser = await db.collection('users').findOne({ _id: ObjectID(likedUserId) })
    if (likedUser.likedPersons.includes(userId)) {
      createChat(userId, likedUserId);
    }
  } catch(err) {
    return console.error(err);
  }
}

// Creates a new chat in the database and links it to two users
async function createChat(id, otherId) {
  try {
    const lastChat = await db.collection('chats').findOne({}, { sort: { chatNumber: -1 }, limit: 1 });
    const chatNumber = lastChat === null ? 0 : lastChat.chatNumber+1;
    await db.collection('chats').insertOne({
      chatNumber: chatNumber, users: [id, otherId], messages: []
    });
    await db.collection('users').updateOne(
      { _id: ObjectID(id) },
      { $push: { "chats": chatNumber } }
    )
    await db.collection('users').updateOne(
      { _id: ObjectID(otherId) },
      { $push: { "chats": chatNumber } }
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
    await db.collection('chats').deleteOne({ chatNumber: chat.chatNumber });
    // Delete chat for the users
    users.forEach(async (user) => {
      await db.collection('users').updateOne({ _id: ObjectID(user) }, { $pull: { 'chats': chat.chatNumber } });
    })
  } catch(err) {
    console.error(err);
  }
}

module.exports = router;