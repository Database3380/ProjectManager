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

router.post('/login', function (req, res, next) {
    var credentials = req.body;

    const error = curry(handler)(next);

    const userFetched = function (users) {
        let user = users[0];
        const hashFetched = function (hashes) {
            let hash = hashes[0].password;

            const hashCompared = function (result) {
                if (result) {
                    req.session.user = user;
                    res.redirect('/');
                } else {
                    res.redirect('/');
                }
            }
            compare(credentials.password, hash).then(hashCompared).catch(error);
        }
        user.getHash(hashFetched, error);
    }
    
    User.where('email', credentials.email).limit(1).get(userFetched, error);
});

router.post('/logout', function (req, res, next) {
    console.log(req.session);
    const logout = function (err) {
        console.log(req.session);
        if (err) return next(new Error([err]));

        res.redirect('/');
    }

    req.session.destroy(logout);
}); 


module.exports = router;