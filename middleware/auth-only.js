var authOnly = function (req, res, next) {
    if (!req.auth) {
        let error = new Error('Not authorized to access this uri.');
        error.status = 401;
        next(error);
    }

    next()
}


module.exports = authOnly;