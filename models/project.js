/********************************************************/
// Model Imports
var Model = require('./model');

/********************************************************/

class Project extends Model {
    constructor(project) {
        super();
        if (project) {
            this.id = project.id;
            this.name = project.name;
            this.description = project.description;
            this.budget = project.budget
            this.dueDate = project.due_date || project.dueDate;
            this.userId = project.user_id || project.userId;
            this.departmentId = project.department_id || project.departmentId; 
        }  
    }

    department() {
        return this.belongsTo(Department);
    }

    user() {
        return this.belongsTo(User);
    }

    tasks() {
        return this.hasMany(Task);
    }

    time() {
        return this.hasMany(TimeBlock);
    }
}



module.exports = Project


var Department = require('./department');
var Task = require('./task');
var TimeBlock = require('./time-block');
var User = require('./user');