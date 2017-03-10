var router = require('express').Router();
var AuthError = require('../util/errors/AuthenticationError');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homepage', results: [] });
});



module.exports = router;
