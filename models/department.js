/********************************************************/
// Model Imports
var Model = require('./model');

/********************************************************/

class Department extends Model {
    constructor(department) {
        super();
        if (department) {
            this.id = department.id;
            this.name = department.name;
            this.userId = department.user_id || department.userId;
        }
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


var User = require('./user');
var Project = require('./project');