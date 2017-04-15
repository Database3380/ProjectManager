/********************************************************/
// Package Imports
var router = require('express').Router();

var _ = require('lodash');

// Model Imports
var Task = require('../models/task');
var User = require('../models/user');
var Project = require('../models/project');

// Middlware Imports
var authOnly = require('../middleware/auth-only');
var milliToTime = require('../util/functions/milliToTime');
/********************************************************/

router.use(authOnly);



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
    task.description.replace(/\r?\n|\r/, '');

    try {
        var user = await User.where('id', task.userId).first();
        task.userInitials = user.name.split(' ').map(name => name[0]).join('');
        var newTask = await Task.create(task);
    } catch (err) {
        return next(err);
    }

    res.redirect('/dashboard');
    // res.json(newTask);
});


router.get('/create', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var projects = await Project.get();
        var users = await User.get();
    } catch (err) {
        return next(err);
    }

    if (!user.admin) {
        projects = projects.filter(function (project) {
            return project.departmentId == user.departmentId;
        });

        users = users.filter(function (assignee) {
            return assignee.departmentId == user.departmentId;
        });
    }

    res.render('creation/task',{
        title: 'New Task',
        auth: req.auth,
        user: user,
        projects: projects,
        users: users
    });
});


/* Get Task with Id */
router.get('/:id', async function (req, res, next) {
    var user = new User(req.session.user);
    var taskId = req.params.id;

    try {
        var task = await Task.where('id', taskId).with('project', 'timeBlocks', 'user').first();
        // var activeTimeBlock = await user.timeBlocks().where('end_time', null).where('task_id', task.id).limit(1).first();
    } catch (err) {
        return next(err);
    }

    var allTimeBlocks = task.with.timeBlocks.filter(timeBlock => timeBlock.userId == user.id);
    var timeWorked = allTimeBlocks.reduce(function (acc, block) {
        return acc + block.duration;
    }, 0);

    
    task.with.timeBlocks = allTimeBlocks.filter(timeBlock => !timeBlock.endTime);

    if (task.with.timeBlocks.length > 0) {
        // Crazy work around to ensure timestamp is in correct timezone
        var currentTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', hour12: false }) + ' CST').getTime()
        // console.log(101, new Date().getTime(), task.with.timeBlocks[0].startTime.getTime());
        timeWorked += currentTime - task.with.timeBlocks[0].startTime.getTime();
    }
    task.worked = milliToTime(timeWorked);

    res.render('task', { 
        title: `Task Id: ${taskId}`, 
        auth: Boolean(user), 
        user: user, 
        task: task
    });
});



router.post('/:id/complete', async function (req, res, next) {
    var user = new User(req.session.user);
    var taskId = req.params.id;

    try {
        var task = await user.tasks().where('id', taskId).first();
        var result = await task.update({ completed: !task.completed });
    } catch (err) {
        return next(err);
    }

    res.json(result);
});

module.exports = router;