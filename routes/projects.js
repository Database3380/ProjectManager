/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var Project = require('../models/project');
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

    try {
        var newProject = await Project.create(project);
    } catch (err) {
        return next(err);
    }

    res.json(newProject);
});

router.get('/create', async function (req, res, next) {
    res.render('creation/project', { title: 'New Project', auth: Boolean(req.session.user) });
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