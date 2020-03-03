const express = require('express');
const router = express.Router();
const path = require('path');
const slug = require('slug');
const bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  let blogPosts = [
    {
        title: 'Perk is for real!',
        body: '...',
        author: 'Aaron Larner',
        publishedAt: new Date('2016-03-19'),
        createdAt: new Date('2016-03-19')
    },
    {
        title: 'Development continues...',
        body: '...',
        author: 'Aaron Larner',
        publishedAt: new Date('2016-03-18'),
        createdAt: new Date('2016-03-18')
    },
    {
        title: 'Welcome to Perk!',
        body: '...',
        author: 'Aaron Larner',
        publishedAt: new Date('2016-03-17'),
        createdAt: new Date('2016-03-17')
    }
];
  res.render('index', { posts: blogPosts });
});

/* GET about page. */
router.get('/about', (req, res, next) => {
  res.render('about', { });
});

/* GET contact page. */
router.get('/contact', (req, res, next) => {
  res.render('contact', { });
});

/* GET chat page. */
router.get('/chat', (req, res, next) => {
  res.render('chat', { });
});

/* GET add page. */
router.get('/add', (req, res, next) => {
  res.render('add', { });
});

let movies = [
  {
      title: 'Titanic',
      description: 'This is the titanic',
  },
  {
      title: 'Titanic2',
      description: 'This is the titanic2',
  }
];

/* GET movies page. */
router.get('/movies', (req, res, next) => {
  res.render('movies', { movies: movies }) 
});

router.post('/', (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  movies.push({
    title: title,
    description: description
  });
  res.redirect('movies');
});

// Dynamic route with params
router.get('/profile/:id', (req, res, next) => {
  res.send('You requested to see a profile with the id of ' + req.params.id);
});

router.get("/mp3", (req, res, next) => {
  console.log(path.join(__dirname, '..', 'public', 'assets', 'music', 'birthday-horn.mp3'));
  res.sendFile(path.join(__dirname, '..', 'public', 'assets', 'music', 'birthday-horn.mp3'));
 });
module.exports = router;
