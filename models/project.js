/********************************************************/
// Model Imports
var Model = require('./model');
var Department = require('./department');
var Task = require('./task');
var TimeBlock = require('./time-block');
var User = require('./user');
/********************************************************/


class Project extends Model {
    constructor() {
        super();
        this.id = project.id;
        this.name = project.name;
        this.description = project.description;
        this.budget = project.budget
        this.dueDate = project.due_date;
        this.userId = project.user_id;
        this.projectId = project.department_id;   
    }

    department() {
        return this.belongsTo(Department);
    }

    manager() {
        return this.belongsTo(User);
    }

    tasks() {
        return this.hasMany(Task);
    }

    time() {
        return this.hasMany(TimeBlock);
    }
}



module.exports = Project;