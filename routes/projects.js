/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var Project = require('../models/project');
var User = require('../models/user');
var Department = require('../models/department');
// Middlware Imports
var authOnly = require('../middleware/auth-only');

var _ = require('lodash');
/********************************************************/

router.use(authOnly);

/* Get all projects */
router.get('/', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var projects = await Project.get();
        projects = await Promise.all(projects.map(async (project) => {
            if (project.userId) {
                project.with = {};
                project.with.user = await User.where('id', project.userId).first();
            }
            return project;
        }));
    } catch (err) {
        return next(err);
    }

    res.render('overviews/projects', { 
        title: 'Projects', 
        auth: req.auth,
        user,
        projects 
    });
});


/* Store new project */
router.post('/', async function (req, res, next) {
    var project = req.body;
    project.description = project.description.replace(/\r?\n|\r/, '');

    try {
        var newProject = await Project.create(project);
    } catch (err) {
        return next(err);
    }

    res.redirect('/dashboard');
    // res.json(newProject);
});

router.get('/create', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var users = await User.get();
        var departments = await Department.get();
    } catch (err) {
        return next(err);
    }

    if (!user.admin) {
        users = users.filter(function (manager) {
            return manager.departmentId == user.departmentId;
        });

        departments = departments.filter(function (department) {
            return department.id == user.departmentId
        });
    }

    res.render('creation/project', { 
        title: 'New Project', 
        auth: req.auth, 
        user: user,
        users: users, 
        departments: departments 
    });
});

/* Get project with id */
router.get('/:id', async function (req, res, next) {
    var user = new User(req.session.user);
    var id = req.params.id;

    try {
        var project = await Project.where('id', id).limit(1).with('tasks', 'user', 'department').first();
    } catch (err) {
        return next(err);
    }

    project.with.tasks = _.orderBy(project.with.tasks, 'dueDate');

    res.render('project', { 
        title: `Project with id = ${id}`, 
        auth: req.auth, 
        user: user, 
        project: project 
    });
})


router.post('/:id/complete', async function (req, res, next) {
    var user = new User(req.session.user)
    var id = req.params.id;

    try {
        var project = await Project.where('id', id).limit(1).with('tasks').first();

        incompleteTasks = project.with.tasks.filter(task => !task.complete);
        if (incompleteTasks.length > 0) {
            var error = "All tasks must be completed before completing project.";
        } else {
            var result = await project.update({ complete: !project.complete });
        }
    } catch (err) {
        return next(err);
    }

    res.json({result, error});
});

module.exports = router;