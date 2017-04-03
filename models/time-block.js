/********************************************************/
// Model Imports
var Model = require('./model');

/********************************************************/


class TimeBlock extends Model {
    constructor(timeBlock) {
        super();
        if (timeBlock) {
            this.id = timeBlock.id;
            this.userId = timeBlock.user_id;
            this.taskId = timeBlock.task_id;
            this.projectId = timeBlock.project_id;
            this.startTime = new Date(timeBlock.start_time);
            this.endTime = timeBlock.end_time ? new Date(timeBlock.end_time) : null;
            this.duration = this.endTime ? this.endTime.getTime() - this.startTime.getTime() : null;
        }
    }

    user() {
        return this.belongsTo(User);
    }

    project() {
        return this.belongsTo(Project);
    }

    task() {
        return this.belongsTo(Task);
    }
}



module.exports = TimeBlock;


var Project = require('./project');
var Task = require('./task');
var User = require('./user');