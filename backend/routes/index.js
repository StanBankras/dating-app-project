const express = require('express');
const router = express.Router();
const path = require('path');
const slug = require('slug');
const multer  = require('multer');
const fs = require('file-system');
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

// Mongo setup code, most directly from MongoDB Atlas documentation
let db = null;
let movies = null;
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
router.post('/', upload.single('cover'), async (req, res) => {
  const title = slug(req.body.title);
  const description = slug(req.body.description);
  const cover = req.file ? slug(req.file.filename) : '';
  try {
    await db.collection('movies').insertOne({
      title: title,
      description: description,
      cover: cover
    })
  } catch(err) {
    console.error(error);
  }

  res.redirect('/');
});

// Receives post requests from a form to edit movie title or movie description
router.post('/edit', async (req, res) => {
  if (req.body.newTitle) {
    const newTitle = slug(req.body.newTitle);
    const movieNr = slug(req.body.movieNr);
    // Update title in database
    try {
      await db.collection('movies').updateOne(
        { _id: ObjectID(movieNr) },
        { $set: { "title": newTitle } }
      )
    } catch(err) {
      console.error(error);
    }

    res.redirect('/')

  } else if (req.body.newDescription) {
    const newDescription = slug(req.body.newDescription);
    const movieNr = slug(req.body.movieNr);
    // Update description in database
    try {
      await db.collection('movies').updateOne(
        { _id: ObjectID(movieNr) },
        { $set: { "description": newDescription } }
      )
    } catch(err) {
      console.error(error);
    }

    res.redirect('/')
  }
});

// Delete movie in the list
router.post('/delete', async (req, res) => {

  // Use the movieNr (move id) to find the right entry in the MongoDB
  const movieNr = slug(req.body.movieNr);

  try {
    const deletingMovie = await db.collection('movies').findOne({ _id: ObjectID(movieNr) });
    // Remove the cover from the uploads folder (as this isnt done by removing the item in the database!)
    // Information on how to delete a file with file-system found here: https://stackoverflow.com/a/36614925
    if (deletingMovie.cover) {
      const coverPath = 'public/uploads/' + deletingMovie.cover;
      fs.stat(coverPath, (err, stats) => {     
        if (err) {
          return console.error(err);
        }
        fs.unlink(coverPath, (err) => {
          if(err) return console.log(err);
          console.log('file deleted successfully');
        });  
     });
    }
    // Delete movie by _id
    await db.collection('movies').deleteOne({ _id: ObjectID(movieNr) })
  } catch(err) {
    console.error(err);
  }
  res.redirect('/')
});

// Send other file instead of rendering EJS/html
router.get("/mp3", (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'assets', 'music', 'birthday-horn.mp3'));
});

module.exports = router;
