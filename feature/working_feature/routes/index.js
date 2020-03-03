const express = require('express');
const router = express.Router();
const path = require('path');
const slug = require('slug');
const bodyParser = require('body-parser');

// Render homepage with matches
router.get('/', function(req, res, next) {
  res.render('index', { matches: matches });
});

// Render chats
router.get('/chats', function(req, res, next) {
  res.render('chats', { });
});

// Render chat
router.get('/chat', function(req, res, next) {
  res.render('chat', { });
});

// Dynamic route with params
router.get('/profile/:id', (req, res, next) => {
  res.send('You requested to see a profile with the id of ' + req.params.id);
});

let matches = [
  {
    name: 'Frank',
    lastname: 'Visser',
    age: 36,
    picture: "https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    name: 'Mark',
    lastname: 'de Jong',
    age: 30,
    picture: "http://www.kevmill.com/wp-content/uploads/2019/09/cropped-Kevin-profile-pic-2019-square-small.jpg"
  }
]

module.exports = router;
