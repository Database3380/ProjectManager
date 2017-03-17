/********************************************************/
// Package Imports
var router = require('express').Router();
/********************************************************/


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('index', { title: 'Homepage', results: [], auth: req.auth });
});


router.get('/app', function(req, res, next) {
  res.render('index', { title: 'Homepage', results: [], auth: req.auth, app: true });
});


module.exports = router;
