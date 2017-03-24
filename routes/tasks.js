/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var Task = require('../models/task');
var User = require('../models/user');

// Middlware Imports
var authOnly = require('../middleware/auth-only');
/********************************************************/

// router.use(authOnly);


/* Get all Tasks */
router.get('/', async function (req, res, next) {

    try {
        var tasks = await Task.get();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: 'Tasks', results: tasks, auth: req.auth });
});


/* Store new Task */
router.post('/', async function (req, res, next) {
    let task = req.body;

    try {
        var newTask = await Task.create(task);
    } catch (err) {
        return next(err);
    }

    res.json(newTask);
});


/* Get Task with Id */
router.get('/:id', async function (req, res, next) {
    var user = new User(req.session.user);
    var taskId = req.params.id;

    try {
        var task = await user.tasks().where('id', taskId).first();
    } catch (err) {
        return next(err);
    }

    res.render('task', { title: `Task Id: ${taskId}`, auth: Boolean(user), task: task });
});


module.exports = router;