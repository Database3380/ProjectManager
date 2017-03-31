var authOnly = function (req, res, next) {
    if (!req.auth) {
        res.redirect('/auth/login');
        return;
    }

    next();
}


module.exports = authOnly;