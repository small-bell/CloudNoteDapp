var express = require('express');
var router = express.Router();
var Result = require('../models/Result');
var Note = require('../models/Note');
/**
 * 主页
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
    console.log(result)
    res.send("aaa");
  }).catch((err) => {
    console.log(err);
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
  global.database.addNote(username, note.title, note.content)
      .then((result) => {

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

});

/**
 * 查询笔记
 */
router.get('query', function (req, res, next) {

});
module.exports = router;
