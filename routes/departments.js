var router = require('express').Router();
var Department = require('../models/department');


/* Get Departments */
router.get('/', function (req, res, next) {
    
    var success = function (departments) {
        console.log(departments);
        res.render('index', { title: 'Departments', results: departments });
    }

    var error = function (err) {
        console.log(err);
        return next(new Error([err]));
    }

    Department.get( success, error );
});

/* Store New Department */
router.post('/', function (req, res, next) {
    const department = req.body;

    const success = function (result) {
        console.log(result);
        res.json(result);
    }

    const error = function (err) {
        console.log(err);
        return next(new Error([err]));
    }

    Department.create(department, success, error);
});

/* Show Department With Id */
router.get('/:id', function (req, res, next) {
  var id = req.params.id;

  const success = function (department) {
      console.log(department);
      res.render('index', { title: `Department with id = ${id}`, results: department });
  }

  const error = function (err) {
      console.log(err);
      return next(new Error([err]));
  }

  Department.where('id', id).limit(1).get(success, error);
});


module.exports = router;

