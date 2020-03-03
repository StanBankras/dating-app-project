var express = require('express');
var path = require('path');

// Router in different file
var indexRouter = require('./routes/index');

var app = express();


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
