var bcrypt = require('bcrypt');

async function hash(password) {
  var saltRounds = 10;
  var salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

module.exports = hash;