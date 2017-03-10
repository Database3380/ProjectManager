var Model = require('./model');

var TimeBlock = function (timeBlock) {
    this.id = timeBlock.id;
    this.userId = timeBlock.user_id;
    this.taskId = timeBlock.task_id;
    this.projectId = timeBlock.project_id;
    this.startTime = new Date(timeBlock.start_time);
    this.endTime = new Date(timeBlock.end_time);
    this.duration = this.endTime.getTime() - this.startTime.getTime();
}

TimeBlock.prototype = new Model;

TimeBlock.prototype.constructor = TimeBlock;

Object.assign(TimeBlock, Model);

module.exports = TimeBlock;