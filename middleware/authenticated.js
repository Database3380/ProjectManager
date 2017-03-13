var check = function (req, res, next) {
    console.log(req.session);
    if (req.session.user) {
        req.auth = true;
    } else {
        req.auth = false;
    }


    next();
}


module.exports = check;