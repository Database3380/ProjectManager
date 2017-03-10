var Promise = require('promise');
var pg = require('pg');
var pool = new pg.Pool();

var operators = require('../util/constants/operators');
var snakeCase = require('../util/functions/snake-case');

/****************************************************************************************************
 * Model Object Prototype
 * 
 * Intended to be extended by the models for application.
 * 
 * Has both dynamic and static properties/methods:
 * - Static properties are used for querying the database to retrieve models of that typeof.
 * - Dynamic properties are used for querying the database in relation to a specific instance of a model.
 ****************************************************************************************************/

/**
 * Dyanmic Model Constructor
 */
var Model = function () {
    this.query = '';
}

/***************************
 * Dynamic Model Methods
 ***************************/
Model.prototype.queryString = function () {
    console.log(this.query);
}


/************************
 * Static Properties
 *************************/

/**
 * Query is used for building the query string when using static methods.
 */
Model.query = '';



/*************************
 * Static Methods
 *************************/

/**
 * select() is used to add the select clause to the query string
 * pass in an array of fields for the model being queried
 * 
 * this function does execute the query, has to followd by get()
 * 
 * @param {array} fields | optional
 * 
 * @return {object}
 */
Model.select = function (fields) {
    this.query = 'SELECT ';

    if (!fields || fields.length == 0) {
        this.query += '* ';
    } else {
        fields.forEach(function (field, index) {
            if (index == fields.length - 1) {
                this.query += `${field} `;
            } else {
                this.query += `${field}, `;
            }
        }, this);
    }

    this.query += `FROM ${this.name.toLowerCase()}s`;

    return this;
}


/**
 * where() adds the where clause to the query string
 * will automatically add a select * clause to query string if not already added
 * 
 * returns `this` for function chaining
 * 
 * @param {string} column | required
 * @param {enum} operator | defaults to `=`
 * @param {any} value     | required
 * 
 * @return {object}
 */
Model.where = function (column, operator, value) {
    if (!this.query.includes('SELECT')) {
        this.query = `SELECT * FROM ${this.name.toLowerCase()}s`;
    }

    this.query += ` WHERE ${column} `;

    if (operators.includes(operator)) {
        this.query += `${operator} ${value}`;
    } else {
        value = operator;
        this.query += `= ${value}`;
    }

    return this;
}

/**
 * limit() adds the limit clause to the query string
 * will automatically add a select * clause to query string if not already added
 * 
 * returns `this` for function chaining
 * 
 * @param {number} limit | required
 * 
 * @return {object}
 */
Model.limit = function (limit) {
    if (!this.query.includes('SELECT')) {
        this.query = `SELECT * FROM ${this.name.toLowerCase()}s`;
    }

    this.query += ` LIMIT ${limit}`;

    return this;
}

/**
 * get() is the execution function for the query
 * must be called at the end of every query build
 * will automatically add the select * clause to query if not already added 
 * 
 * success and error parameters are the functions to be used when resolving the
 * asynchronous promise needed to query database
 * 
 * @param {function} success | required
 * success is passed an array of results from the executed query
 * EX: success(results) {
 *          console.log(results);
 *      }
 * 
 * @param {function} error   | required
 * error is passed an error object created by query execution
 * EX: error(err) {
 *          console.log(err);
 *      }
 */
Model.get = function (success, error) {
    if (!this.query.includes('SELECT')) {
        this.query = `SELECT * FROM ${this.name.toLowerCase()}s`;
    }

    var hydrate = this.hydrate.bind(this);

    const q = this.promise(this.query, hydrate);

    q.then(success).catch(error);
    
    this.query = '';
}


/**
 * create() is used to store a new tuple of the calling models type
 * 
 * tuple is an object composed of all the necessary key => value pairs to create a new tuple in db
 * tuple key names will be automatically converted from camelCase to snake_case to be aligned with database attribute names
 * 
 * success and error parameters are the functions to be used when resolving the
 * asynchronous promise needed to query database
 * 
 * @param {object} tuple     | required
 * @param {function} success | required
 * success is passed an array of results from the executed query
 * EX: success(results) {
 *          console.log(results);
 *      }
 * @param {function} error   | required
 * error is passed an error object created by query execution
 * EX: error(err) {
 *          console.log(err);
 *      }
 */
Model.create = function (tuple, success, error) {
    this.query = `INSERT INTO ${this.name.toLowerCase()}s (`;

    let keys = Object.keys(tuple);
    let values = '';

    keys.forEach(function (key, index) {
        this.query += `${snakeCase(key)}`;
        let value = tuple[key];
        if (typeof value === 'string') {
            values += `'${value}'`
        } else {
            values +=`${value}`
        }

        if (index !== keys.length - 1) {
            this.query += ', ';
            values += ', '
        }
    }, this);
    
    this.query += `) VALUES (${values}) RETURNING *`;

    var hydrate = this.hydrate.bind(this);

    const q = this.promise(this.query, hydrate);

    q.then(success).catch(error);
}


/**
 * promise() is used to build the generic promise wrapper for database queries
 * 
 * @param {string} query     | required
 * @param {function} hydrate | required
 * IMPORTANT: hydrate must be bound to the `this` object before being passed into Promise
 * EX: var hydrate = this.hydrate.bind(this)
 *     const p = this.promise(query, hydrate);
 */
Model.promise = function (query, hydrate) {
    return new Promise(function (resolve, reject) {
        pool.query(query, function (err, result) {
            if (err) {
                reject(err);
                return;
            }

            resolve(hydrate(result.rows));
        });
    });
}

/**
 * hydrate() is used to query results into named and functional objects of the correct type
 * 
 * @param {array} objects
 */
Model.hydrate = function (objects) {
    return objects.map(function (object) {
        return new this(object);
    }, this);
}




module.exports = Model;