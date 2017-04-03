var router = require('express').Router();

var _ = require('lodash');

var authOnly = require('../middleware/auth-only');
var User = require('../models/user');

router.get('/', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var tasks = await user.tasks().where('completed', false).with('project').get();
    } catch (err) { 
        return next(err);
    }
    tasks = _.sortBy(tasks, 'dueDate');
    var projects = _.sortBy(_.uniqBy(tasks.map(task => task.with.project), 'id'), 'dueDate');

    res.render('dashboard', { 
        title: `${user.name}'s Tasks`, 
        auth: Boolean(user), 
        user: user, 
        completed: false, 
        tasks: tasks, 
        projects: projects 
    });
});

router.get('/completed', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var tasks = await user.tasks().where('completed', true).with('project').get();
    } catch (err) { 
        return next(err);
    }
    tasks = _.sortBy(tasks, 'dueDate');
    var projects = _.sortBy(_.uniqBy(tasks.map(task => task.with.project), 'id'), 'dueDate');

    res.render('dashboard', { 
        title: `${user.name}'s Tasks`, 
        auth: Boolean(user), 
        user: user, 
        completed: true, 
        tasks: tasks, 
        projects: projects 
    });
});

module.exports = router; 