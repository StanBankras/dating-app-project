const express = require('express');
const router = express.Router();
const path = require('path');
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;

// Load environment variables
require('dotenv').config();

// Mongo setup code, most directly from MongoDB Atlas documentation
let db = null;
const MongoClient = mongo.MongoClient;
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

// Load the newest version of movies and then render the home page
router.get('/', async (req, res, next) => {
  let movies;
  try {
    movies = await db.collection('movies').find().toArray();
  } catch(err) {
    console.error(err);
  }
  res.render('movies', { movies: movies })
});

// Page for websockets practice
router.get('/chat', (req, res, next) => {
  res.render('chat', {});
});

// Page that hosts the form to add a new movie to the MongoDB
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
    // Update title in database
    db.collection('movies').updateOne(
      { _id: ObjectID(movieNr) },
      { $set: { "title": newTitle } }
    )
    .then((response) => console.log(response.modifiedCount))
    .catch(err => { console.log(err) });

    res.redirect('/')

  } else if (req.body.newDescription) {
    const newDescription = req.body.newDescription;
    const movieNr = req.body.movieNr;
    // Update description in database
    db.collection('movies').updateOne(
      { _id: ObjectID(movieNr) },
      { $set: { "description": newDescription } }
    )
    .then((response) => console.log(response.modifiedCount))
    .catch(err => { console.log(err) });

    res.redirect('/')
  }
});

router.post('/delete', async (req, res) => {
  const movieNr = req.body.movieNr;
  // Delete movie by _id
  try {
    await db.collection('movies').deleteOne({ _id: ObjectID(movieNr) })
  } catch(err) {
    console.error(err);
  }
  res.redirect('/')
});

router.get("/mp3", (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'assets', 'music', 'birthday-horn.mp3'));
});

module.exports = router;
