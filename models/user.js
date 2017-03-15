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
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.payRate = user.pay_rate;
        this.admin = user.admin;
        this.departmentId = user.department_id;
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