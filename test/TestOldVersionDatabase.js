// web0.20的测试用例，修改后已经不可使用
// 可以忽略

var Database = require('../api/EthDatabase');
var sleep = require('system-sleep');
var database = new Database();
var nonce = database.getNonce();
console.log('nonce: ' + nonce);
global.nonce = --nonce;
global.getNextNonce = function () {
    global.nonce ++;
    return '0x' + global.nonce.toString(16);
};
//随机生成id，name，content
var id = Math.random().toString(36).substr(2);
var name = Math.random().toString(36).substr(2);
console.log('id: ' + id);
console.log('name: ' + name);
var hash = database.addNote(id, name, "笔记内容");
console.log('添加笔记交易hash: ' + hash);
var status = null;
while((status = database.queryTransactionStatus(hash))==null) {
    sleep(1000);
}
if (status == 1) {
    console.log('添加笔记成功');
    console.log('云笔记内容: ' + database.getNote(id, name));
    //随机产生笔记内容
    var content = Math.random().toString(36).substr(2);
    console.log('content: ' + content);
    hash = database.updateNote(id, name, content);
    console.log('修改笔记内容交易: ' + hash);
    while((status = database.queryTransactionStatus(hash))==null) {
        sleep(1000);
    }
    if (status == 1) {
        console.log('云笔记修改成功');
        console.log('云笔记内容: ' + database.getNote(id, name));
    } else if (status == 0) {
        console.log('云笔记修改失败');
    }
} else if (status == 0) {
    console.log('云笔记添加失败');
}

