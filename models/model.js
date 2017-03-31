/********************************************************/
// Package Imports
var pg = require('pg');
var pool = new pg.Pool();

// Util Imports
var operators = require('../util/constants/operators');
var snakeCase = require('../util/functions/snake-case');
var singular = require('../util/functions/singular');
/********************************************************/


/****************************************************************************************************
 * Model Object Prototype
 *
 * Intended to be extended by the models for application.
 *
 * Has both dynamic and static properties/methods:
 * - Static properties are used for querying the database to retrieve models of that typeof.
 * - Dynamic properties are used for querying the database in relation to a specific instance of a model.
 ****************************************************************************************************/


class Model {

    constructor() {
        this.query = '';
        this.withModels = [];
    }

    /***************************
     * Dynamic Methods
     ***************************/

    hasOne(model) {
        return model.where(`${this.constructor.name.toLowerCase()}_id`, this.id).limit(1);
    }

    hasMany(model) {
        console.log(40, model);
        return model.where(`${this.constructor.name.toLowerCase()}_id`, this.id);
    }

    belongsTo(model) {
        return model.where('id', this[`${model.name.toLowerCase()}Id`]).limit(1);
    }

    property(property) {
        return this.constructor.select(property).where('id', this.id).first(true);
    }

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
    static select(...fields) {
        let instance = this.getInstance();
        return instance.select(...fields);
    }


    select (...fields) {
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

        this.query += `FROM ${snakeCase(this.constructor.name)}s`;

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
    static where(column, operator, value) {
        let instance = this.getInstance();
        return instance.where(column, operator, value);
    }


    where(column, operator, value) {
        if (!this.query.includes('SELECT')) {
            this.query = `SELECT * FROM ${snakeCase(this.constructor.name)}s`;
        }

        value = value || operator;

        if (!operators.includes(operator)) {
            operator = '=';
        }

        this.query += ` WHERE ${column} ${operator} '${value}'`

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
    static limit(limit) {
        let instance = this.getInstance();
        return instance.limit(limit);
    }


    limit(limit) {
        if (!this.query.includes('SELECT')) {
            this.query = `SELECT * FROM ${snakeCase(this.constructor.name)}s`;
        }

        this.query += ` LIMIT ${limit}`;

        return this;
    }


    /**
     * with() adds models to the static property withModels
     * can be called at any point in the query string before executing (ex. get(), first())
     *
     * Pass in the name of the function defining the relationship
     * EX. if User has a function named department() that defines a belongsTo relationship to
     *     Department class then you would use the argument 'department' in the with function.
     *
     *     User.where('id', 1).with('department').first();=
     * @param {...string} models | required
     *
     * @return {object}
     */
    static with(...models) {
        let instance = this.getInstance();
        return instance.with(...models);
    }


    with(...models) {
        this.withModels = models;
        return this;
    }


    /**
     * get() is the execution function for the query
     * must be called at the end of every query build
     * will automatically add the select * clause to query if not already added
     *
     * @return {array} hydrated results, typeof calling model
     */
    static async get(raw = false, instance = false) {
        let _instance = this.getInstance();
        return _instance.get(raw, instance);
    }


    async get(raw = false, instance = false) {
        if (!this.query.includes('SELECT')) {
            this.query = `SELECT * FROM ${snakeCase(this.constructor.name)}s`;
        }

        try {
            var result = await pool.query(this.query);
        } catch (err) {
            throw err;
        }

        this.query = '';

        if (raw) {
            return instance ? result.rows[0] : result.rows;
        } else {
            var results = this.hydrate(result.rows);

            if (this.withModels.length > 0) {
                results = await this.fetchWith(results);
            }

            return instance ? results[0] : results;
        }
    }

    /**
     * first() executes the get() function with the instance argument set as true
     * this causes get() to return a single instance from the query not an array of results
     *
     * @return {function}
     */
    static first(raw = false) {
        return this.get(raw, true);
    }


    first(raw = false) {
        return this.get(raw, true);
    }

    /**
     * create() is used to store a new tuple of the calling models type
     *
     * tuple is an object composed of all the necessary key => value pairs to create a new tuple in db
     * tuple key names will be automatically converted from camelCase to snake_case to be aligned with database attribute names
     *
     * @return {object} single hydrated model from tuple, typeof calling model
     */
    static async create(tuple) {
        let keys = Object.keys(tuple).map(key => snakeCase(key)).join(', ');
        let values = Object.values(tuple).map(function (value) {
            if (typeof value === 'string') {
                return `'${value}'`;
            } else {
                return value
            }
        }).join(', ');

        this.query = `INSERT INTO ${snakeCase(this.constructor.name)}s (${keys}) VALUES (${values}) RETURNING *`;

        try {
            var result = await pool.query(this.query);
        } catch (err) {
            throw err;
        }

        this.query = '';

        return this.hydrate(result.rows)[0];
    }

    /**
     * fetchWith() attaches the models in withModels to each result
     * the relevant models will be attached to each result in a object set as the
     * with property. (ex. result.with = { department: {}, projects: [] })
     *
     * @param {array} results | required
     *
     * @return {Promise} returns a parallel promise object
     */
    fetchWith(results) {
        return Promise.all(results.map(async function (result) {
            result.with = {};
            for (let model of this.withModels) {
                console.log(result)
                result.with[model] = singular(model) ? await result[model]().first() : await result[model]().get();
            }
            return result;
        }, this))
    }


    /**
     * hydrate() is used to query results into named and functional objects of the correct type
     *
     * @param {array} objects | required
     */
    hydrate(objects) {
        return objects.map(function (object) {
            return new this.constructor(object);
        }, this);
    }

    static getInstance() {
        return new this();
    }

}


/**
 * Initialize static query property
 * used in the static functions when building queries
 */
Model.query = '';


Model.withModels = [];


module.exports = Model;