/********************************************************/
// Util Imports
var hash = require('../util/functions/hash');

// Model Imports
var Model = require('./model');
var Project = require('./project');
var Department = require('./department');
var Task = require('./task');
var TimeBlock = require('./time-block');
/********************************************************/

class User extends Model {
    constructor(user) {
        super();
        this.id = user ? user.id : null;
        this.name = user ? user.name : null;
        this.email = user ? user.email : null;
        this.payRate = user ? user.pay_rate : null;
        this.admin = user ? user.admin : null;
        this.departmentId = user ? user.department_id : null;
    }

    department() {
        return this.belongsTo(Department);
    }

    manages() {
        return this.hasOne(Department);
    }

    projects() {
        return this.hasMany(Project);
    }

    tasks() {
        return this.hasMany(Task);
    }

    worked() {
        return this.hasMany(TimeBlock);
    }

    async hash() {
        let object = await this.property('password');
        return object.password;
    }
}


module.exports = User;