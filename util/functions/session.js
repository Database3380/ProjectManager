var uuid = require('uuid');

function generate() {
    return uuid.v1();
}

module.exports = generate;