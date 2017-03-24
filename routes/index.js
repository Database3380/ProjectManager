/********************************************************/
// Package Imports
var router = require('express').Router();
var Project = require('../models/project');
var Task = require('../models/task');
/********************************************************/


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(Project);
  console.log(Task);
  res.render('index', { title: 'Homepage', results: [], auth: req.auth });
});



module.exports = router;
