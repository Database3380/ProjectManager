var Model = require('./model');


class PastDue extends Model {
    constructor(pastDue) {
        super();
        if (pastDue) {
            this.id = pastDue.id;
            this.taskId = pastDue.taskId || pastDue.task_id;
            this.userId = pastDue.userId || pastDue.user_id;
            this.dueDate = pastDue.dueDate || pastDue.due_date;
            this.completedDate = pastDue.completedDate || pastDue.completed_date;
        }
    }

    task() {
        return this.belongsTo(Task);
    }

    user() {
        return this.belongsTo(User);
    }
}


module.exports = PastDue;

var Task = require('./task');
var User = require('./user');