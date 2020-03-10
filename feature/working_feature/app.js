const express = require('express');
const path = require('path');
const axios = require('axios');

// Router in different file
const indexRouter = require('./routes/index');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(express.static('public'));

/* 404 PAGE route */ 
app.use(function(req,res){
    res.status(404).render('404.ejs');
});

module.exports = app;
