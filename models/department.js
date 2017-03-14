/********************************************************/
// Model Imports
var Model = require('./model');
var User = require('./user');
var Project = require('./project');
/********************************************************/

class Department extends Model {
    constructor(department) {
        super();
        this.id = department.id;
        this.name = department.name;
        this.userId = department.user_id;
    }

    employees() {
        return this.hasMany(User);
    }

    manager() {
        return this.belongsTo(User);
    }

    projects() {
        return this.hasMany(Project);
    }
}

module.exports = Department;