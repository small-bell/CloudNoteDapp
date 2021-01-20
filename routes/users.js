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
  var t1 = {
    1: "aaa",
    2: "bbb",
    3: "ccc"
  }

  console.log(`SELECT username, password from user WHERE 
  username=${t1} and password=${t1}`);
});

/**
 * 注册
 */
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
  res.send(new Result("Aaa").addItem({
    "aaa":"aaa"
  }).addItem({
    "bbb": "bbb"
  }));
});

/**
 * 登录
 */
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
        { expires: new Date(Date.now() + 900000),
          httpOnly: true });
    res.cookie('username', form.username,
        { expires: new Date(Date.now() + 900000),
          httpOnly: true });
    res.send("login");
  }, (err) => {
    console.log(err);
    res.send(new Result("登录错误").fail());
  });
});


module.exports = router;
