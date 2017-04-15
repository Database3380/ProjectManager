/********************************************************/
// Package Imports
var router = require('express').Router();

// Model Imports
var Department = require('../models/department');
var User = require('../models/user');

// Middlware Imports
var authOnly = require('../middleware/auth-only');
/********************************************************/

router.use(authOnly);

/* Get Departments */
router.get('/', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var departments = await Department.get();
        departments = await Promise.all(departments.map(async (department) => {
            if (department.userId) {
                department.with.user = await User.where('id', department.userId).first();
            }
            return department;
        }));
    } catch (err) {
        return next(err);
    }

    res.render('overviews/departments', { 
        title: 'Departments', 
        auth: req.auth,
        user,
        departments 
    });
});

/* Store New Department */
router.post('/', async function (req, res, next) {
    const department = req.body;
    
    if (department.userId === 'None') delete department.userId;

    try {
        var newDepartment = await Department.create(department);
    } catch (err) {
        return next(err);
    }

    res.redirect('/dashboard');
    // res.json(newDepartment);
});

router.get('/create', async function (req, res, next) {
    var user = new User(req.session.user);
    
    try {
        var users = await User.get();
    } catch (err) {
        return next(err);
    }

    res.render('creation/department', { 
        title: 'New Department', 
        auth: req.auth, 
        user: user,
        users: users 
    });
});

/* Show Department With Id */
router.get('/:id', async function (req, res, next) {
    var user = new User(req.session.user);
    var id = req.params.id;

    try {
        var department = await Department.where('id', id).limit(1).with('users', 'projects').first();
        if (department.userId) {
            department.with.user = await department.user().first();
        }
    } catch (err) {
        return next(err);
    }

    res.render('department', { 
        title: `Project Manager | ${department.name}`,  
        auth: req.auth ,
        user: user,
        department: department
    });
});




module.exports = router;

