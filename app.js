var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var credentials = require('./config/credentials');

////////////////初始化以太坊//////////////////////
var Database = require('./api/EthDatabase');
database = new Database();
global.database = database;
new Promise((resolve, reject) => {
  var nonce = database.getNonce();
  resolve(nonce);
}).then((nonce) => {
  global.nonce = nonce;
  global.getNextNonce = function () {
    global.nonce++;
    return '0x' + global.nonce.toString(16);
  };
  console.log("global nonce : " + global.getNextNonce());
}, (err) => {
  console.log(err);
});

/////////////////////////////////////////////////
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookieSecret));
//表单处理
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//验证登录中间件
app.use(function (req, res, next) {
  if (req.url === '/users/login' || req.url === '/users/register') {
    next();
    return;
  }
  var login = req.cookies.login;
  //TODO 验证cookie
  if (!login && req.url !== '/') {
    res.redirect('/');
  }
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
