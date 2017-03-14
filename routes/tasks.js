/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var Task = require('../models/task');
/********************************************************/


/* Get all Tasks */
router.get('/', async function (req, res, next) {

    try {
        var tasks = await Task.get();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: 'Tasks', results: tasks });
});


/* Store new Task */
router.post('/', async function (req, res, next) {
    let task = req.body;

    try {
        var newTask = Task.create(task);
    } catch (err) {
        return next(err);
    }

    res.json(newTask);
});


/* Get Task with Id */
router.get('/:id', async function (req, res, next) {
    let id = req.params.id;

    try {
        var task = await Task.where('id', id).limit(1).first();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: `Task with id = ${id}`, results: task });
})


module.exports = router;