/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var Department = require('../models/department');

// Middlware Imports
var authOnly = require('../middleware/auth-only');
/********************************************************/

router.use(authOnly);

// This is a test comment. Henry Chau

/* Get Departments */
router.get('/', async function (req, res, next) {

    try {
        var departments = await Department.get();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: 'Departments', results: departments, auth: req.auth });
});

/* Store New Department */
router.post('/', async function (req, res, next) {
    const department = req.body;

    try {
        var newDepartment = await Department.create(department);
    } catch (err) {
        return next(err);
    }

    res.json(newDepartment);
});

/* Show Department With Id */
router.get('/:id', async function (req, res, next) {
  var id = req.params.id;

  try {
    var department = await Department.where('id', id).limit(1).first();
  } catch (err) {
      return next(err);
  }

  res.render('index', { title: `Department with id = ${id}`, results: [department], auth: req.auth });
});


module.exports = router;

