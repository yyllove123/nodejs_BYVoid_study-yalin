// 日志功能添加
var fs = require('fs');
var accessLogfile = fs.createWriteStream('access.log',{flags : 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags : 'a'});


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session')
var MongoStore = require("connect-mongo")(session);
var flash = require('connect-flash');

var settings = require('./bin/setting');
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var post = require('./routes/post');
var reg = require('./routes/reg');

var util = require('util');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(flash());
// app.use(express.logger({stream : accessLogfile}));

app.use(session( {
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db
    }),
    resave: false,
    saveUninitialized: true
}));

// 访问过滤
app.use(function(req, res, next) {
    var user = req.session.user;
    var err = req.flash("error");
    var success = req.flash("success");

    res.locals.user = user ? user : null;
    res.locals.error = err.length > 0 ? err : null;
    res.locals.success = success.length > 0 ? success : null;

    next();
});

// 访问日志
app.use(function(req, res, next) {
    var error = res.locals.error;
    if (error) {
        var meta = '[' + new Date() + '] ' + req.url + ' ' + err.message + '\n';
        errorLogfile.write(meta + err.stack + '\n');
    }
    else {
        var message = req.url
        var meta = '[' + new Date() + '] ' + req.url + ' ' + util.inspect(req.body) + ' ' + util.inspect(req.params);
        accessLogfile.write(meta + '\n');
    }
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/post', post);
app.use('/reg', reg);
app.use('/login', login);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// 错误日志
app.use(function(err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + ' ' + err.message + '\n';
    errorLogfile.write(meta + err.stack + '\n');
    next();
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            title: '牛逼的错误页面',
            user: res.locals.user,
            error: err,
            success: res.locals.success
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        title: '牛逼的错误页面',
        user: res.locals.user,
        error: err,
        success: res.locals.success
    });
});


module.exports = app;
