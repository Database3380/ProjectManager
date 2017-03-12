/********************************************************/
// Package Imports
var router = require('express').Router();
var curry = require('curry');

// Util Imports
var handler = require('../util/errors/handler');

// Model Imports
var Department = require('../models/department');
/********************************************************/


// This is a test comment. Henry Chau

/* Get Departments */
router.get('/', function (req, res, next) {
    
    var success = function (departments) {
        console.log(departments);
        res.render('index', { title: 'Departments', results: departments });
    }

    var error = curry(handler)(next);

    Department.get( success, error );
});

/* Store New Department */
router.post('/', function (req, res, next) {
    const department = req.body;

    const success = function (result) {
        console.log(result);
        res.json(result);
    }

    var error = curry(handler)(next);

    Department.create(department, success, error);
});

/* Show Department With Id */
router.get('/:id', function (req, res, next) {
  var id = req.params.id;

  const success = function (department) {
      console.log(department);
      res.render('index', { title: `Department with id = ${id}`, results: department });
  }

  var error = curry(handler)(next);

  Department.where('id', id).limit(1).get(success, error);
});


module.exports = router;

