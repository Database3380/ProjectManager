var Model = require('./model');
var hash = require('../util/functions/hash');

var Project = require('./project');

var User = function (user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.payRate = user.pay_rate;
    this.admin = user.admin;
    this.departmentId = user.department_id;
}

User.prototype = new Model;

User.prototype.constructor = User;

Object.assign(User, Model);

User.prototype.projects = function (success, error) {
    return this.hasMany(Project, success, error);
}

module.exports = User;