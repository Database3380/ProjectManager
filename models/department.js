/********************************************************/
// Model Imports
var Model = require('./model');
/********************************************************/


var Department = function(department) {
    this.id = department.id;
    this.name = department.name;
    this.userId = department.user_id;
}

// Get prototype methods from Model
Department.prototype = new Model;

//Set constructor for reference in Model functions
Department.prototype.constructor = Department;

// Get static methods from Model
Object.assign(Department, Model);

module.exports = Department;