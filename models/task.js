var Model = require('./model');

var Task = function(task) {
    this.id = task.id;
    this.name = task.name;
    this.description = task.description;
    this.dueDate = task.due_date;
    this.userId = task.user_id;
    this.projectId = task.project_id;
}

Task.prototype = new Model;

Task.prototype.constructor = Task;

Object.assign(Task, Model);

module.exports = Task;