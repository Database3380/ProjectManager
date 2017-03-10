/********************************************************/
// Package Imports
var router = require('express').Router();
var curry = require('curry');

// Util Imports
var hash = require('../util/functions/hash');
var handler = require('../util/errors/handler');

// Model Imports
var User = require('../models/user');
/********************************************************/


/* GET users listing. */
router.get('/', function(req, res, next) {
  const success = function (users) {
    res.render('index', { title: 'Users', results: users });
  }
  
  const error = curry(handler)(next);

  User.get(success, error);
});


/* Store new User */
router.post('/', function (req, res, next) {
  const user = req.body;
  user.password = hash(user.password);

  const success = function (user) {
    console.log(user);
    res.json(user);
  }

  const error = curry(handler)(next);

  User.create(user, success, error);
});


/* Get all projects for user with :id */
router.get('/:id/projects', function (req, res, next) {
  let id = req.params.id;

  const error = curry(handler)(next);

  const userFetched = function (users) {
    let user = users[0];
    const success = function (projects) {
      res.render('index', { title: `Projects for ${user.name}`, results: projects });
    }

    user.projects(success, error);
  }

  User.where('id', id).limit(1).get(userFetched, error);
});


/* Get department that user with :id works in */
router.get('/:id/department', function (req, res, next) {
  let id = req.params.id;

  const error = curry(handler)(next);

  const userFetched = function (users) {
    let user = users[0];
    const success = function (department) {
      res.render('index', { title: `Department that ${user.name} works in.`, results: department });
    }

    user.department(success, error);
  }

  User.where('id', id).limit(1).get(userFetched, error);
});


module.exports = router;
