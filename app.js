var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Middleware
var authenticated = require('./middleware/authenticated');

// Routes
var index = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var departments = require('./routes/departments');
var tasks = require('./routes/tasks');
var projects = require('./routes/projects');
var timeBlocks  = require('./routes/time-blocks');
var dashboard = require('./routes/dashboard');

var admin = require('./routes/admin');

<<<<<<< HEAD
=======

>>>>>>> set_up_base_for_react_front_end
// App Initialization
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Hydrogen5to10!',
  name: 'db-proj-sessionId',
  resave: false,
  saveUninitialized: false
}));

app.use(authenticated);

app.use(express.static(path.join(__dirname + '/public')));

app.use('/', index);
app.use('/auth', auth);
app.use('/users', users);
app.use('/departments', departments);
app.use('/tasks', tasks);
app.use('/projects', projects);
app.use('/time-blocks', timeBlocks);
app.use('/dashboard', dashboard);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  if (req.method === 'POST') {
    res.status(err.status || 500);
    res.json({error: err.message});
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
