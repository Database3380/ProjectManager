/********************************************************/
// Package Imports
var router = require('express').Router();

// Util Imports
var hash = require('../util/functions/hash');

// Model Imports
var User = require('../models/user');
var Department = require('../models/department');


// Middlware Imports
var authOnly = require('../middleware/auth-only');
/********************************************************/

// router.use(authOnly);


/* GET users listing. */
router.get('/', async function(req, res, next) {

    try {
      var users = await User.get();
    } catch (err) {
      return next(err);
    }

    res.render('index', { title: 'Users', results: users, auth: req.auth });
});


/* Store new User */
router.post('/', async function (req, res, next) {
  const user = req.body;
  user.admin = user.admin || false;

  try {
    user.password = await hash(user.password);
    var newUser = await User.create(user);
  } catch (err) {
    return next(err);
  }

  res.json(newUser);
});

router.get('/create', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var departments = await Department.get();
    } catch (err) {
        return next(err);
    }

    if (!user.admin) {
      departments = departments.filter(function (department) {
        return department.id == user.departmentId;
      });
    }

    res.render('creation/user', { 
      title: 'New User', 
      auth: Boolean(req.session.user), 
      departments: departments,
      admin: user.admin 
    });
});


/* Get all projects for user with :id */
router.get('/:id/projects', async function (req, res, next) {
  let id = req.params.id;

  try {
    var user = await User.where('id', id).limit(1).first();
    var projects = await user.projects().get();
  } catch (err) {
    return next(err);
  }

  res.render('index', { title: `Projects for ${user.name}`, results: projects, auth: req.auth });
});


/* Get department that user with :id works in */
router.get('/:id/department', async function (req, res, next) {
  let id = req.params.id;

  try {
    var user = await User.where('id', id).limit(1).first();
    var department = await user.department().first();
  } catch (err) {
    return next(err);
  }

  res.render('index', { title: `Department that ${user.name} works in.`, results: [department], auth: req.auth });
});



module.exports = router;
