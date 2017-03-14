
/************* DEPRECATED ****************/
/**
 * May reuse later if universal handler becomes necessary again
 */
var error = function (next, err) {
    return next(new Error([err]));
}

module.exports = error;