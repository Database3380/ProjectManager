/********************************************************/
// Package Imports
var router = require('express').Router();
var Project = require('../models/project');
var Task = require('../models/task');
/********************************************************/


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }

  // res.render('index', { title: 'Homepage', results: [], auth: req.auth });
});


router.get('/app', function(req, res, next) {
  res.render('index', { title: 'Homepage', results: [], auth: req.auth, app: true });
});


module.exports = router;
