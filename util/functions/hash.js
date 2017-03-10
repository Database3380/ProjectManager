var bcrypt = require('bcrypt');

function hash(password) {
  var saltRounds = 10;
  var salt = bcrypt.genSaltSync(saltRounds);
  
  return bcrypt.hashSync(password, salt);
}

module.exports = hash;