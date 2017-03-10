var Model = require('./model');

var Project = function (project) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.budget = project.budget
    this.dueDate = project.due_date;
    this.userId = project.user_id;
    this.projectId = project.department_id;
}

Project.prototype = new Model;

Project.prototype.constructor = Project;

Object.assign(Project, Model);

module.exports = Project;