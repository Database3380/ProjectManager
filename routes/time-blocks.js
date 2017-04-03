/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var TimeBlock = require('../models/time-block');
var User = require('../models/user');

var timestamp = require('../util/functions/timestamp');

// Middlware Imports
var authOnly = require('../middleware/auth-only');
/********************************************************/

router.use(authOnly);


/* Get all Time Blocks */
router.get('/', async function (req, res, next) {

    try {
        var timeBlocks = await TimeBlock.get();
    } catch (err) {
        return next(err);
    }

    res.render('index', { title: 'Time Blocks', results: timeBlocks, auth: req.auth });
});


/* Store new Time Block */
router.post('/', async function (req, res, next) {
    var user = new User(req.session.user);
    var timeBlock = req.body;
    timeBlock.userId = user.id;
    timeBlock.startTime = timestamp();

    try {
        var currentTimeBlocks = await user.timeBlocks().where('end_time', null).get();
        if (currentTimeBlocks.length > 0) {
            throw new Error('Can not be working on more than one task simultaneously.')
        }
        var newTimeBlock = await TimeBlock.create(timeBlock);
    } catch (err) {
        return next(err);
    }

    res.json(newTimeBlock);
});

router.post('/:id', async function (req, res, next) {
    var user = new User(req.session.user);
    var id = req.params.id;

    try {
        var timeBlock = await TimeBlock.where('id', id).limit(1).first();
        var newTimeBlock = await timeBlock.update({ endTime: timestamp() });
    } catch (err) {
        return next(err);
    }
    console.log(newTimeBlock);
    res.json(newTimeBlock);
})


module.exports = router;