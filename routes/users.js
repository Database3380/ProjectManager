var router = require('express').Router();
var hash = require('../util/functions/hash');
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  const success = function (users) {
    console.log(users);
    res.render('index', { title: 'Users', results: users });
  }

  const error = function (err) {
    console.log(err);
    return next(new Error([err]));
  }

  User.get(success, error);
});

router.post('/', function (req, res, next) {
  const user = req.body;
  user.password = hash(user.password);

  const success = function (user) {
    console.log(user);
    res.json(user);
  }

  const error = function (err) {
    console.log(err);
    return next(new Error([err]));
  }

  User.create(user, success, error);
});

module.exports = router;
