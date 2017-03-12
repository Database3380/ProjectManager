/********************************************************/
// Package Imports
var router = require('express').Router();
var curry = require('curry');

// Util Imports
var handler = require('../util/errors/handler');

// Model Imports
var Task = require('../models/task');
/********************************************************/


/* Get all Tasks */
router.get('/', function (req, res, next) {
    const success = function (tasks) {
        res.render('index', { title: 'Tasks', results: tasks });
    }

    const error = curry(handler)(next);

    Task.get(success, error);
});


/* Store new Task */
router.post('/', function (req, res, next) {
    let task = req.body;

    const success = function (task) {
        res.json(task)
    }

    const error = curry(handler)(next);

    Task.create(task, success, error);
});


/* Get Task with Id */
router.get('/:id', function (req, res, next) {
    let id = req.params.id;

    const success = function (task) {
        res.render('index', { title: `Task with id = ${id}`, results: task });
    }

    const error = curry(handler)(next);

    Task.where('id', id).limit(1).get(success, error);
});
module.exports = router;