var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { });
});
/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { });
});
/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { });
});

module.exports = router;
