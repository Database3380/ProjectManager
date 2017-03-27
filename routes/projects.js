/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var Project = require('../models/project');
var User = require('../models/user');
var Department = require('../models/department');
// Middlware Imports
var authOnly = require('../middleware/auth-only');
/********************************************************/

// router.use(authOnly);

/* Get all projects */
router.get('/', async function (req, res, next) {

    try {
        var projects = await Project.get();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: 'Projects', results: projects, auth: req.auth });
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

    res.json(newProject);
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
        auth: Boolean(req.session.user), 
        users: users, 
        departments: departments 
    });
});

/* Get project with id */
router.get('/:id', async function (req, res, next) {
    let id = req.params.id;

    try {
        var project = await Project.where('id', id).limit(1).first();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: `Project with id = ${id}`, results: project, auth: req.auth });
})


module.exports = router;