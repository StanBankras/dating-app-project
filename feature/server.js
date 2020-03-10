const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const port = 3000;
const server = http.createServer(app);
const indexRouter = require('./routes/index');
const websockets = require('./websockets.js');

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', indexRouter); // Routing in separate file

// 404 page route
app.use(function(req,res){
    res.status(404).render('404.ejs');
});

server.listen(port);
server.on('listening', () => console.log('Listening on port ' + port));