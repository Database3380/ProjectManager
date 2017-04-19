/********************************************************/
// Package Imports
var router = require('express').Router();
var _ = require('lodash');

// Util Imports
var hash = require('../util/functions/hash');

// Model Imports
var User = require('../models/user');
var Department = require('../models/department');


// Middlware Imports
var authOnly = require('../middleware/auth-only');
/********************************************************/

router.use(authOnly);


/* GET users listing. */
router.get('/', async function(req, res, next) {
    var user = new User(req.session.user);

    try {

        var users;
        if (user.admin) {
          users = await User.with('department').get();
        } else {
          users = await User.where('department_id', user.departmentId).with('departments').get();
        }
    } catch (err) {
        return next(err);
    }

    res.render('overviews/users', { 
        title: 'users', 
        auth: req.auth,
        user,
        users 
    });
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

  res.redirect('/dashboard');
  // res.json(newUser);
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
      auth: req.auth, 
      user: user,
      departments: departments,
      admin: user.admin 
    });
});

router.get('/:id', async function (req, res, next) {
  var loggedIn = new User(req.session.user);
  var id = req.params.id;

  try {
    var user = await User.where('id', id).with('tasks', 'projects', 'department').limit(1).first();
  } catch (err) {
    return next(err);
  }

  user.with.projects = _.sortBy(user.with.projects, 'dueDate');
  user.with.tasks = _.sortBy(user.with.tasks, ['completed', 'dueDate']);
  
  res.render('user', {
    title: `Project Manager | ${user.name}`,
    auth: req.auth,
    user: loggedIn,
    data: user
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
