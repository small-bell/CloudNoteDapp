// 对以太坊的操作

var express = require('express');
var router = express.Router();

var Result = require('../models/Result');
var Note = require('../models/Note');

const moment = require('moment')
var Sqlite3 = require('../utils/Sqlite3');
var db = Sqlite3.getInstance();
db.connect('E:\\NodejsProgram\\cloudnote\\db\\cloudnote.db');

/**
 * 将带有address的note插入到数据库
 * @param note
 */
function insertNote(note) {
  var currentTime =  moment(Date.now())
      .format('YYYY-MM-DD HH:mm:ss');
  console.log(currentTime);
  db.runSql(`insert into note (userid, title, createdate, address) VALUES('${note.userId}', '${note.title}', '${currentTime}', '${note.address}')`);
}
/**
 * 主页
 */
router.get('/', function(req, res, next) {

});

/**
 * 测试
 */
router.get('/test', function (req, res, next) {
  var username = req.cookies.username;
  if (!username) {
    res.send(new Result('登录过期，请重新登陆').fail());
    res.redirect('/');
    return;
  }
  global.database.getNonce().then((result) => {
    console.log(result);

    res.send(new Result("操作成功").addItem(result).success());
  }).catch((err) => {
    console.log(err);
    res.send(new Result("测试失败").fail());
})

})

/**
 * 发布笔记
 */
router.post('/note', function (req, res, next) {
  var username = req.cookies.username;
  if (!username) {
    res.send(new Result('登录过期，请重新登陆').fail());
    res.redirect('/');
    return;
  }
  // TODO 用户验证
  // 表单验证
  if (!(req.body.title && req.body.content)) {
    res.send(new Result("笔记内容不能为空"));
    return;
  }
  //构造note
  var note = new Note(
      username,
      req.body.title,
      req.body.content
  );
  console.log(note);
  global.database.addNote(username, note.title, note.content)
      .then((result) => {
        console.log(result);
        insertNote(note.addAddress("000"));
        res.send(result);
      }, (err) => {
        console.log(err);
        res.send(new Result("操作以太坊失败,请重试").fail());
      });
});

/**
 * 修改笔记
 */
router.post('/change', function (req, res, next) {
  var username = req.cookies.username;
  if (!username) {
    res.send(new Result('登录过期，请重新登陆').fail());
    res.redirect('/');
    return;
  }
  // TODO 用户验证
  // 表单验证
  if (!(req.body.title && req.body.content)) {
    res.send(new Result("笔记内容不能为空"));
    return;
  }
  //构造note
  var note = new Note(
      username,
      req.body.title,
      req.body.content
  );
  global.database.updateNote(username, note.title, note.content)
        .then((result) => {
          console.log(result);
          res.send(result);
        }, (err) => {
          console.log(err);
          res.send(new Result("操作以太坊失败,请重试").fail());
        });

});

/**
 * 查询笔记
 */
router.get('/query', function (req, res, next) {
  var username = req.cookies.username;
  if (!username) {
    res.send(new Result('登录过期，请重新登陆').fail());
    res.redirect('/');
    return;
  }
  global.database.getNote("zebrpnykk5o", "yf6fjxtbfb")
      .then((result) => {
        console.log(result);
        res.send(new Result("操作成功").addItem(result).success());
      }, (err) => {
        console.log(err);
        res.send(new Result("操作以太坊失败,请重试").fail());
      })
});
module.exports = router;
