/********************************************************/
// Model Imports
var Model = require('./model');
var User = require('./user');
var Project = require('./project');
/********************************************************/

class Department extends Model {
    constructor(department) {
        super();
        this.id = department ? department.id : null;
        this.name = department ? department.name : null;
        this.userId = department ? department.user_id : null;
    }

    users() {
        console.log(User);
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