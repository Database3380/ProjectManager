/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var TimeBlock = require('../models/time-block');
/********************************************************/


/* Get all Time Blocks */
router.get('/', async function (req, res, next) {

    try {
        var timeBlocks = await TimeBlock.get();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: 'Time Blocks', results: timeBlocks });
});


/* Store new Time Block */
router.post('/', async function (req, res, next) {
    let timeBlock = req.body;

    try {
        var newTimeBlock = TimeBlock.create(timeBlock);
    } catch (err) {
        return next(err);
    }

    res.json(newTimeBlock);
});


module.exports = router;