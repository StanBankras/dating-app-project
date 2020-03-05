const express = require('express');
const router = express.Router();
const path = require('path');

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

// Receives post requests from a form to edit movie title or movie description
router.post('/edit', (req, res) => {
  if (req.body.newTitle) {
    const newTitle = req.body.newTitle;
    const movieNr = req.body.movieNr;
    movies[movieNr].title = newTitle;
    res.redirect('movies');
  } else if (req.body.newDescription) {
    const newDescription = req.body.newDescription;
    const movieNr = req.body.movieNr;
    movies[movieNr].description = newDescription;
    res.redirect('movies');
  }
});

router.post('/delete', (req, res) => {
  const movieNr = req.body.movieNr;
  movies.splice(movieNr, 1);
  res.redirect('movies');
});

router.get("/mp3", (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'assets', 'music', 'birthday-horn.mp3'));
 });
 
module.exports = router;
