var singular = function (string) {
    return string.slice(-1) !== 's';
}

module.exports = singular;