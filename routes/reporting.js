var router = require('express').Router();

var User = require('../models/user');
var Department = require('../models/department');
var Project = require('../models/project');
var Task = require('../models/task');
var PastDue = require('../models/past-due');

var _ = require('lodash');
var milliToTime = require('../util/functions/milliToTime');

router.get('/', function (req, res, next) {
    var user = new User(req.session.user);

    res.render('reporting', {
        title: 'Project Manager | Reporting',
        auth: req.auth,
        user: user
    });
});

router.get('/department', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var departments = await Department.get();
    } catch (err) {
        return next(err);
    }
    res.render('reporting', {
        title: 'Project Manager | Reporting',
        auth: req.auth,
        user: user,
        departments: departments
    });
});

router.post('/department', async function (req, res, next) {
    var user = new User(req.session.user);
    var { departmentId, startDate, endDate, delineate } = req.body;

    try {
        if (departmentId == 'All') {
            var departments = await Department.get();
            var projects = await Project.where('created_at', '<=', startDate).with('timeBlocks').get()

            departments = departments.map(function (department, index) {
                department.worked = milliToTime(projects.filter(project => project.departmentId == department.id)
                                            .reduce((total, project) => {
                                                var projTot = project.with.timeBlocks.reduce((acc, timeBlock) => {
                                                    if (new Date(timeBlock.startTime) >= new Date(startDate) && new Date(timeBlock.endTime) <= new Date(endDate)) {
                                                        return acc + timeBlock.duration;
                                                    } else {
                                                        return acc;
                                                    }
                                                }, 0);
                                                return total + projTot;
                                            }, 0), true);
                return department;
            });
        } else {
            var department = await Department.where('id', departmentId).first();

            if (delineate == 'project') {
                var projects = await Project.where('department_id', departmentId).where('created_at', '<=', startDate).with('timeBlocks').get();
                projects = projects.map((project) => {
                    project.worked = milliToTime(project.with.timeBlocks.reduce((acc, timeBlock) => {
                        if (new Date(timeBlock.startTime) >= new Date(startDate) && new Date(timeBlock.endTime) <= new Date(endDate)) {
                            return acc + timeBlock.duration;
                        } else {
                            return acc;
                        }
                    }, 0), true);
                    delete project.with;
                    return project;
                });
            } else {
                var users = await User.where('department_id', departmentId).where('created_at', '<=', startDate).with('timeBlocks').get();
                users = users.map((user) => {
                    user.worked = milliToTime(user.with.timeBlocks.reduce((acc, timeBlock) => {
                        if (new Date(timeBlock.startTime) >= new Date(startDate) && new Date(timeBlock.endTime) <= new Date(endDate)) {
                            return acc + timeBlock.duration;
                        } else {
                            return acc;
                        }
                    }, 0), true);
                    delete user.with;
                    return user;
                });
            }
        }
    } catch (err) {
        return next(err);
    }
    var period= `${startDate} to ${endDate}`;

    if (departmentId == 'All') {
        res.render('reports/department', { 
            title: 'Report for all departments',
            auth: req.auth,
            user,
            period,
            departments
        });
    } else {
        res.render('reports/department', { 
            title: 'Report for all departments',
            auth: req.auth,
            user,
            period,
            department, 
            projects,
            users
        });
    }

});

router.get('/project', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var projects = await Project.get();
    } catch (err) {
        return next(err);
    }
    res.render('reporting', {
        title: 'Project Manager | Reporting',
        auth: req.auth,
        user: user,
        projects: projects
    });
});

router.post('/project', async function (req, res, next) {
    var user = new User(req.session.user);
    var { projectId, startDate, endDate, delineate } = req.body;

    try {
        if (projectId == 'All') {
            var projects = await Project.where('created_at', '<=', startDate).with('timeBlocks').get();

            projects = projects.map((project) => {
                project.worked = milliToTime(project.with.timeBlocks.reduce((acc, timeBlock) => {
                    if (new Date(timeBlock.startTime) >= new Date(startDate) && new Date(timeBlock.endTime) <= new Date(endDate)) {
                        return acc + timeBlock.duration;
                    } else {
                        return acc;
                    }
                }, 0), true);
                delete project.with;
                return project;
            });
        } else {
            var project = await Project.where('id', projectId).with('timeBlocks').first();

            var timeBlocks = [];
            project.with.timeBlocks.forEach((timeBlock) => {
                if (new Date(timeBlock.startTime) >= new Date(startDate) && new Date(timeBlock.endTime) <= new Date(endDate)) {
                    let index = _.findIndex(timeBlocks, ['id', timeBlock[`${delineate}Id`]]);
                    if (index != -1) {
                        timeBlocks[index].duration += timeBlock.duration;
                    } else {
                        timeBlocks.push({id: timeBlock[`${delineate}Id`], duration: timeBlock.duration});
                    }
                }
            })

            delete project.with;

            if (delineate == 'task') {
                var tasks = await Promise.all(timeBlocks.map(async (timeBlock) => {
                    var task = await Task.where('id', timeBlock.id).first();
                    task.worked = milliToTime(timeBlock.duration, true);
                    return task;
                }))
            } else {
                var users = await Promise.all(timeBlocks.map(async (timeBlock) => {
                    var user = await User.where('id', timeBlock.id).first();
                    user.worked = milliToTime(timeBlock.duration, true);
                    return user;
                }));
            }
        }
    } catch (err) {
        return next(err);
    }

    var period = `${startDate} to ${endDate}`;

    if (projects) {
        res.render('reports/project', { 
            title: 'Report for all project',
            auth: req.auth,
            user,
            period,
            projects
        });
    } else {
        res.render('reports/project', { 
            title: 'Report for all projects',
            auth: req.auth,
            user,
            period,
            project,
            users,
            tasks
        });
    }
});

router.get('/user', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var users = await User.get();
    } catch (err) {
        return next(err);
    }
    res.render('reporting', {
        title: 'Project Manager | Reporting',
        auth: req.auth,
        user: user,
        users: users
    });
});


router.post('/user', async function (req, res, next) {
    var curUser = new User(req.session.user);
    var { userId, startDate, endDate, delineate } = req.body;

    try {
        if (userId == 'All') {
            var users = await User.where('created_at', '<=', startDate).with('timeBlocks').get();

            users = users.map((user) => {
                user.worked = milliToTime(user.with.timeBlocks.reduce((acc, timeBlock) => {
                    if (new Date(timeBlock.startTime) >= new Date(startDate) && new Date(timeBlock.endTime) <= new Date(endDate)) {
                        return acc + timeBlock.duration;
                    } else {
                        return acc;
                    }
                }, 0), true);
                delete user.with;
                return user;
            });
        } else {
            var user = await User.where('id', userId).with('timeBlocks').first();

            var timeBlocks = [];
            user.with.timeBlocks.forEach((timeBlock) => {
                if (new Date(timeBlock.startTime) >= new Date(startDate) && new Date(timeBlock.endTime) <= new Date(endDate)) {
                    let index = _.findIndex(timeBlocks, ['id', timeBlock.taskId]);
                    if (index != -1) {
                        timeBlocks[index].duration += timeBlock.duration;
                    } else {
                        timeBlocks.push({id: timeBlock.taskId, duration: timeBlock.duration });
                    }
                }
            });

            delete user.with;

            var tasks = await Promise.all(timeBlocks.map(async (timeBlock) => {
                var task = await Task.where('id', timeBlock.id).first();
                task.worked = milliToTime(timeBlock.duration, true);
                return task;
            }));
        }
        
    } catch (err) {
        return next(err);
    }

    var period = `${startDate} to ${endDate}`;

    if (users) {
        res.render('reports/user', { 
            title: 'Report for all users',
            auth: req.auth,
            user,
            period,
            users
        });
    } else {
        res.render('reports/user', { 
            title: 'Report for all project',
            auth: req.auth,
            user: curUser,
            period,
            rUser: user,
            tasks
        });
    }
})


router.get('/past-due', async function (req, res, next) {
    var user = new User(req.session.user);

    try {
        var pastDues = await PastDue.with('user','task').get();
    } catch (err) {
        return next(err);
    }

    res.render('reports/past-due', {
        title: 'Tasks Completed Past Due',
        auth: req.auth,
        user,
        pastDues
    });
})


module.exports = router;

