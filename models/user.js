var Model = require('./model');
var hash = require('../util/functions/hash');

var User = function (user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.payRate = user.pay_rate;
    this.admin = user.admin;
    this.departmentId = user.department_id;
}

User.prototype = new Model;

Object.assign(User, Model);

module.exports = User;