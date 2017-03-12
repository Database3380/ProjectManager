/********************************************************/
// Package Imports
var router = require('express').Router();
var curry = require('curry');

// Util Imports
var handler = require('../util/errors/handler');

// Model Imports
var Project = require('../models/project');
/********************************************************/


/* Get all projects */
router.get('/', function (req, res, next) {
    const success = function (projects) {
        res.render('index', { title: 'Projects', results: projects });
    }

    const error = curry(handler)(next);

    Project.get(success, error);
});


/* Store new project */
router.post('/', function (req, res, next) {
    let project = req.body;

    const success = function (project) {
        res.json(project);
    }

    const error = curry(handler)(next);

    Project.create(project, success, error);
});


/* Get project with id */
router.get('/:id', function (req, res, next) {
    let id = req.params.id;

    const success = function (project) {
        res.render('index', { title: `Project with id = ${id}`, results: project });
    }

    const error = curry(handler)(next);

    Project.where('id', id).limit(1).get(success, error);
})
module.exports = router;