var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var http = require('http');
var debug = require('debug')('cloudnote:server');

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

// 接口文档
var swaggerInstall = require('./utils/swagger')
swaggerInstall(app)

// 跨域
var cors = require('cors');
app.use(cors());

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * socketio
 * @type {*}
 */
var io = require('socket.io') (server,  {
  cors: {
    origin: '*',
  }
});
global.io = io;
app.use(function(req, res, next){
  res.io = io;
  next();
});

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
  if (req.url === '/users/login' || req.url === '/users/register'
      || req.url === '/') {
    next();
    return;
  }
  var login = req.headers.sign;
  //TODO 验证cookie
  if (!login && req.url !== '/') {
    res.redirect('/');
  }
  next();
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


io.on('connection', function (socket) {

  socket.on('change', function (data) {
    console.log(data);
    setInterval(function () {
      socket.emit('news', { hello: "result" });
    }, 1000)
    // 发送交易
    global.database.updateNote("zebrpnykk5o", "yf6fjxtbfb", 'content: ' +  Math.random().toString(36).substr(2))
        .then((result) => {
          console.log(result);
          socket.emit('news', { hello: result });
        }, (err) => {
          console.log(err);
          socket.emit('news', { hello: err });
        });
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


module.exports = app;
