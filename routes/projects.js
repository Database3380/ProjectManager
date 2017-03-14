/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var Project = require('../models/project');
/********************************************************/


/* Get all projects */
router.get('/', async function (req, res, next) {

    try {
        var projects = await Project.get();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: 'Projects', results: projects });
});


/* Store new project */
router.post('/', async function (req, res, next) {
    let project = req.body;

    try {
        var newProject = Project.create(project);
    } catch (err) {
        return next(err);
    }

    res.json(newProject);
});


/* Get project with id */
router.get('/:id', async function (req, res, next) {
    let id = req.params.id;

    try {
        var project = await Project.where('id', id).limit(1).first();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: `Project with id = ${id}`, results: project });
})


module.exports = router;