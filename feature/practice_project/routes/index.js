const express = require('express');
const router = express.Router();
const path = require('path');

require('dotenv').config();

// Mongo setup code directly from MongoDB Atlas
let db = null;
let movies;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  db = client.db(process.env.DB_NAME);
  db.collection('movies').find().toArray(done)

  function done(err, data) {
    if (err) {
      console.log(uri + ' error');
      next(err)
    } else {
      movies = data;
    }
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  db.collection('movies').find().toArray(done)

  function done(err, data) {
    if (err) {
      console.log(uri + ' error');
      next(err)
    } else {
      movies = data;
      res.render('movies', { movies: movies });
    }
  }
});

/* GET chat page. */
router.get('/chat', (req, res, next) => {
  res.render('chat', {});
});

/* GET add page. */
router.get('/add', (req, res, next) => {
  res.render('add', {});
});

// Post route for adding a new movie to the MongoDB
router.post('/', (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  
  db.collection('movies').insertOne({
    title: title,
    description: description
  }).catch(err => { console.log(err) });

  res.redirect('/');
});

// Receives post requests from a form to edit movie title or movie description
router.post('/edit', (req, res) => {
  if (req.body.newTitle) {
    const newTitle = req.body.newTitle;
    const movieNr = req.body.movieNr;
    movies[movieNr].title = newTitle;
    res.redirect('/');
  } else if (req.body.newDescription) {
    const newDescription = req.body.newDescription;
    const movieNr = req.body.movieNr;
    movies[movieNr].description = newDescription;
    res.redirect('/');
  }
});

router.post('/delete', (req, res) => {
  const movieNr = req.body.movieNr;
  movies.splice(movieNr, 1);
  res.redirect('/');
});

router.get("/mp3", (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'assets', 'music', 'birthday-horn.mp3'));
});

module.exports = router;
