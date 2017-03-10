/********************************************************/
// Package Imports
var router = require('express').Router();
/********************************************************/


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homepage', results: [] });
});



module.exports = router;
