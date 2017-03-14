/********************************************************/
// Model Imports
var Model = require('./model');
var Project = require('./project');
var TimeBlock = require('./time-block');
var User = require('./user');
/********************************************************/


class Task extends Model {
    constructor() {
        super();
        this.id = task.id;
        this.name = task.name;
        this.description = task.description;
        this.dueDate = task.due_date;
        this.userId = task.user_id;
        this.projectId = task.project_id;      
    }

    project() {
        return this.belongsTo(Project);
    }

    assignedTo() {
        return this.belongsTo(User);
    }

    time() {
        return this.hasMany(TimeBlock);
    }
}



module.exports = Task;