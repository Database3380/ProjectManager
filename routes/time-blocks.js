/********************************************************/
// Package Imports
var router = require('express').Router();
var curry = require('curry');

// Util Imports
var handler = require('../util/errors/handler');

// Model Imports
var TimeBlock = require('../models/time-block');
/********************************************************/

router.get('/', function (req, res, next) {
    const success = function (timeBlocks) {
        res.render('index', { title: 'Time Blocks', results: timeBlocks });
    }

    const error = curry(handler)(next);

    TimeBlock.get(success, error);
});


router.post('/', function (req, res, next) {
    let timeBlock = req.body;

    const success = function (timeBlock) {
        res.json(timeBlock);
    }

    const error = curry(handler)(next);

    TimeBlock.create(timeBlock, success, error);
});

module.exports = router;