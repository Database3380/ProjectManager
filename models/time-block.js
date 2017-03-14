/********************************************************/
// Model Imports
var Model = require('./model');
var Project = require('./project');
var Task = require('./task');
var User = require('./user');
/********************************************************/


class TimeBlock extends Model {
    constructor() {
        super();
        this.id = timeBlock.id;
        this.userId = timeBlock.user_id;
        this.taskId = timeBlock.task_id;
        this.projectId = timeBlock.project_id;
        this.startTime = new Date(timeBlock.start_time);
        this.endTime = new Date(timeBlock.end_time);
        this.duration = this.endTime.getTime() - this.startTime.getTime();
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