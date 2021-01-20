// 主合约的测试用例

var Database = require('../api/EthDatabase');

// 初始化database
var database = new Database();

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

database.getNonce().then((res) => {
    initGlobal(res);
    //初始化后启动测试
    testEthDb();
}, (err) => {
    initGlobal(0);
    console.log(err);
});

/**
 * 测试新增笔记
 */
function testInsert() {
    // 随机生成id，name，content
    var id = Math.random().toString(36).substr(2);
    var name = Math.random().toString(36).substr(2);
    console.log('id: ' + id);
    console.log('name: ' + name);
    database.addNote(id, name, "笔记内容").then((res) => {
        console.log("hash");
        console.log(res);
    }, (err) => {
        console.log(err);
    })
}

/**
 * 测试更新笔记
 */
function testUpdate() {
    var content = 'content: ' +  Math.random().toString(36).substr(2);
    database.updateNote("zebrpnykk5o", "yf6fjxtbfb", content);
}

/**
 * 测试查询笔记
 */
function testGetNote(){
    var note = database.getNote("zebrpnykk5o", "yf6fjxtbfb");
    note.then((res) => {
        console.log(res);
    }, (err) => {
        console.log(err);
    });
}

/**
 * 测试查询状态
 */
function testQueryTransactionStatus() {
    database.queryTransactionStatus('0xb54c1c61b9274d7fd659d241e84ddeefc5a84d6880ec6d6da16c642c23741e83')
        .then((res) => {
            console.log(res);
        });
}
/**
 * 测试主函数
 */
function testEthDb() {
    testInsert();

    // testUpdate();

    // testGetNote();

    // testQueryTransactionStatus();
}

