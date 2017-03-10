var error = function (next, err) {
    return next(new Error([err]));
}

module.exports = error;