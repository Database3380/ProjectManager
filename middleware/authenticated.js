var util = require('util');

var check = function (req, res, next) {
    req.auth = Boolean(req.session.user);
    next();
}


module.exports = check;