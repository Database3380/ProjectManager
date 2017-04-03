/********************************************************/
// Model Imports
var Model = require('./model');

/********************************************************/

class Task extends Model {
    constructor(task) {
        super();

        const colors = [
            'red',
            'pink',
            'purple',
            'blue',
            'cyan',
            'teal',
            'green',
            'yellow',
            'orange',
            'deeporange',
            'bluegrey'
        ]

        if (task) {
            this.id = task.id;
            this.name = task.name;
            this.description = task.description;
            this.dueDate = task.due_date || task.dueDate;
            this.completed = task.completed || false;
            this.userInitials = task.user_initials || task.userInitials;
            this.userId = task.user_id || task.userId;
            this.projectId = task.project_id || task.projectId;
            this.userColor = colors[this.userId % 11]
        }      
    }

    project() {
        // var Project = projectInstance();
        return this.belongsTo(Project); 
    }

    user() {
        return this.belongsTo(User);
    }

    timeBlocks() {
        return this.hasMany(TimeBlock);
    }
}



module.exports = Task;

var Project = require('./project');
var TimeBlock = require('./time-block');
var User = require('./user');