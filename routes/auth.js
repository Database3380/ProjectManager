/*************************************************/
// Package Imports
var router = require('express').Router();
var { compare } = require('bcrypt');
var curry = require('curry');

// Util Imports
var handler = require('../util/errors/handler');

// Model Imports
var User = require('../models/user');
/*************************************************/


router.get('/login', function (req, res, next) {
    res.render('auth/login', { title: 'Login | Db-Proj'});
}); 

router.post('/login', async function (req, res, next) {
    var credentials = req.body;

    try {
        var user = await User.where('email', credentials.email).limit(1).first();
        let hash = await user.hash();
        var result = await compare(credentials.password, hash);
    } catch (err) {
        return next(err);
    }

    if (result) {
        req.session.user = user;

        req.session.save(function (err) {
            if (err) return next(err);
            res.redirect('/dashboard');
        });
    } else {
        res.redirect('/');
    }
});

router.post('/logout', function (req, res, next) {
    const logout = function (err) {
        if (err) return next(new Error([err]));

        res.redirect('/');
    }

    req.session.destroy(logout);
}); 


module.exports = router;