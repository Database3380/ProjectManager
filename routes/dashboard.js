var router = require('express').Router();

var _ = require('lodash');

var authOnly = require('../middleware/auth-only');
var User = require('../models/user');

router.get('/', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var tasks = await user.tasks().with('project').get();
    } catch (err) { 
        return next(err);
    }

    var projects = _.sortBy(_.uniqBy(tasks.map(task => task.with.project), 'id'), 'dueDate');

    res.render('dashboard', { title: `${user.name}'s Tasks`, auth: Boolean(user), tasks: tasks, projects: projects });
});


module.exports = router; 