var router = require('express').Router();

var User = require('../models/user');
var Department = require('../models/department');

router.get('/user', async function (req, res, next) {

    try {
        var departments = await Department.get();
    } catch (err) {
        return next(err);
    }

    res.render('creation/user', { title: 'New User', auth: Boolean(req.session.user), departments: departments });
});


module.exports = router;