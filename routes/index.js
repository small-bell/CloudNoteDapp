// 对以太坊的操作
// 因为每次以太坊操作后都会出现nonce不匹配的问题，
// 并且耗时操作需要异步执行，所以先返回等待操作的消息
var express = require('express');
var router = express.Router();
const moment = require('moment');
const Log = require('../utils/Log');

var Result = require('../models/Result');
var Note = require('../models/Note');

var Sqlite3 = require('../utils/Sqlite3');
var db = Sqlite3.getInstance();
db.connect('E:\\NodejsProgram\\cloudnote\\db\\cloudnote.db');

/**
 * 注册socket查询
 */
io.on('connection', function (socket) {
  socket.on('query', function (data) {
    if (data.username && data.title) {
      db.query(`SELECT address FROM note WHERE userid = '${data.username}' AND title = '${data.title}'`, function (res) {
        if (res.length !== 0) {
          socket.emit('success', { code: 1, data: {
              username: data.username,
              title: data.title
            }
          });
        } else {
          socket.emit('fail', { code: 0 });
        }
      })
    }
  });
});

/**
 * 初始化全局主键和主键查询函数
 * @param nonce
 */
function initGlobal(nonce) {
  global.nonce = --nonce;
  global.getNextNonce = function () {
    global.nonce++;
    return '0x' + global.nonce.toString(16);
  }
}

/**
 * 将带有address的note插入到数据库
 * @param note
 */
function insertNote(note) {
  var currentTime =  moment(Date.now())
      .format('YYYY-MM-DD HH:mm:ss');
  db.runSql(`insert into note (userid, title, createdate, address) VALUES('${note.userId}', '${note.title}', '${currentTime}', '${note.address}')`);
}
/**
 * 主页
 */
router.get('/', function(req, res, next) {
  res.send(new Result("等待操作").success());
});

/**
 * 测试
 */
router.get('/test', function (req, res, next) {

})

/**
 * 发布笔记
 */
/**,
 * @swagger
 * /note:
 *    post:
 *      tags:
 *      - 以太坊接口
 *      summary: 发布笔记
 *      produces:
 *      - application/json
 *      parameters:
 *      - title: title
 *        description: 文章标题
 *        required: true
 *        type: string
 *      - content: content
 *        description: 文章内容
 *        required: true
 *        type: string
 *      responses:
 *        0:
 *          description: 执行成功
 *        -1:
 *          description: 执行失败
 *        404:
 *          description: 未找到路径
 * */
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
  Log.log('增加笔记');
  Log.log(JSON.stringify(note));
  global.database.getNonce().then((res1) => {
    initGlobal(res1);
    // 发送交易
    global.database.addNote(username, note.title, note.content)
        .then((result) => {
          insertNote(note.addAddress(result.transactionHash));
          Log.log('交易信息');
          Log.log(JSON.stringify(result));
        }, (err) => {
          Log.log('交易失败');
          Log.log(JSON.stringify(err));
        });
  }, (err) => {
    initGlobal(0);
    Log.log('交易失败');
    Log.log(JSON.stringify(err));
  });
  res.send(new Result("等待操作").success());
});

/**
 * 修改笔记
 */
/**,
 * @swagger
 * /change:
 *    post:
 *      tags:
 *      - 以太坊接口
 *      summary: 修改笔记
 *      produces:
 *      - application/json
 *      parameters:
 *      - title: title
 *        description: 文章标题
 *        required: true
 *        type: string
 *      - content: content
 *        description: 文章内容
 *        required: true
 *        type: string
 *      responses:
 *        0:
 *          description: 执行成功
 *        -1:
 *          description: 执行失败
 *        404:
 *          description: 未找到路径
 * */
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
  Log.log('修改笔记');
  Log.log(JSON.stringify(note));
  global.database.getNonce().then((res1) => {
    initGlobal(res1);
    // 发送交易
    global.database.updateNote(username, note.title, note.content)
        .then((result) => {
          Log.log('交易信息');
          Log.log(JSON.stringify(result));
        }, (err) => {
          Log.log('交易失败');
          Log.log(JSON.stringify(err));
        });
  }, (err) => {
    initGlobal(0);
    Log.log('交易失败');
    Log.log(JSON.stringify(err));
  });
  res.send(new Result("等待操作").success());
});

/**
 * 查询笔记
 */
/**,
 * @swagger
 * /query:
 *    get:
 *      tags:
 *      - 以太坊接口
 *      summary: 查询笔记
 *      produces:
 *      - application/json
 *      parameters:
 *      - title: title
 *        description: 文章标题
 *        required: true
 *        type: string
 *      responses:
 *        0:
 *          description: 执行成功
 *        -1:
 *          description: 执行失败
 *        404:
 *          description: 未找到路径
 * */
router.get('/query', function (req, res, next) {
  var username = req.cookies.username;
  if (!username) {
    res.send(new Result('登录过期，请重新登陆').fail());
    res.redirect('/');
    return;
  }
  global.database.getNote(username, req.query.title)
      .then((result) => {
        console.log(JSON.stringify(result));
        res.send(new Result("操作成功", result).success());
      }, (err) => {
        console.log(err);
        res.send(new Result("操作以太坊失败,请重试").fail());
      })
});


module.exports = router;
