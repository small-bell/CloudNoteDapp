var express = require('express');
var router = express.Router();
const crypto = require('crypto');

var Sqlite3 = require('../utils/Sqlite3');
var db = Sqlite3.getInstance();
db.connect('E:\\NodejsProgram\\cloudnote\\db\\cloudnote.db');

var Result = require('../models/Result');

/**
 * 测试
 */
router.get('/', function(req, res, next) {
  res.send(new Result("测试").success());
});

/**
 * 注册
 */
/**,
 * @swagger
 * /users/register:
 *    post:
 *      tags:
 *      - 用户接口
 *      summary: 用户注册
 *      produces:
 *      - application/json
 *      parameters:
 *      - username: username
 *        description: 用户名
 *        required: true
 *        type: string
 *      - password: password
 *        description: 密码
 *        required: true
 *        type: string
 *      responses:
 *        0:
 *          description: 注册成功
 *        -1:
 *          description: 注册失败
 *        404:
 *          description: 未找到路径
 * */
router.post('/register', function (req, res, next) {
  var form = req.body;
  if (!(form.username && form.password)){
    res.send(new Result("用户名或者密码为空").fail());
    return;
  }
  // 提取username和password
  let picker = ['username', 'password'];
  let userItem = picker.reduce((userItem, item) => {
    if(item in form) {
      userItem[item] = form[item];
    }
    return userItem;
  }, {});
  // 执行数据库操作
  db.insert('insert into user (username, password) ' +
      'values( ?, ?)', userItem);
  res.send(new Result("注册成功").success());
});

/**
 * 登录
 */
/**,
 * @swagger
 * /users/login:
 *    post:
 *      tags:
 *      - 用户接口
 *      summary: 用户登录
 *      produces:
 *      - application/json
 *      parameters:
 *      - username: username
 *        description: 用户名
 *        required: true
 *        type: string
 *      - password: password
 *        description: 密码
 *        required: true
 *        type: string
 *      responses:
 *        0:
 *          description: 登录成功
 *        -1:
 *          description: 登录失败
 *        404:
 *          description: 未找到路径
 * */
router.post('/login', function (req, res, next) {
  var form = req.body;
  if (!(form.username && form.password)){
    res.send(new Result("用户名或者密码为空").fail());
    return;
  }
  new Promise(((resolve, reject) => {
    db.query(`SELECT username, password from user WHERE 
    username=${form.username} and password=${form.password}`,
      (result) => {
          if (result) {
            resolve(result);
          }
      });
  })).then((result) => {
    // 发放cookie
    var cookie = crypto.createHash('sha1').update(form.username
      + '-' + form.password).digest("hex");
    res.cookie('login', cookie,
        { expires: new Date(Date.now() + 2000000),
          httpOnly: true });
    res.cookie('username', form.username,
        { expires: new Date(Date.now() + 2000000),
          httpOnly: true });
    res.send(new Result("登录成功").success());
  }, (err) => {
    console.log(err);
    res.send(new Result("登录错误").fail());
  });
});


module.exports = router;
