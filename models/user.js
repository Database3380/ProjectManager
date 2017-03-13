/********************************************************/
// Util Imports
var hash = require('../util/functions/hash');

// Model Imports
var Model = require('./model');
var Project = require('./project');
var Department = require('./department');
/********************************************************/


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


User.prototype.projects = function () {
    return this.hasMany(Project);
}

User.prototype.department = function () {
    return this.belongsTo(Department);
}

module.exports = User;