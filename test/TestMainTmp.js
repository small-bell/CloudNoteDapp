// 主合约的一些测试临时函数和数据
// 可以忽略

var Web3 = require('web3');
var fs = require('fs');
const EthereumTx = require('ethereumjs-tx').Transaction
var ethabi = require('web3-eth-abi');
var config = require('../config/config');

class Database {
    /**
     * 初始化web3客户端
     */
    constructor() {
        this.contractAddress = config.contractAddress;
        this.gasPrice = config.gasPrice;
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.infuraHttps));
        this.web3.eth.defaultAccount = config.account;
        this.abi = JSON.parse(fs.readFileSync(
            '../contract/CloudNoteService_sol_CloudNoteService.abi'
        ).toString());
        this.contract = new this.web3.eth.Contract(this.abi,this.contractAddress);
        // this.contract = this.web3.eth.contract(this.abi).at(this.contractAddress);
    }

    /**
     * 获取当前账户已经发布的交易数
     * @returns {Promise<number>}
     */
    getNonce() {
        //调用合约的以太坊账户
        var nonce = this.web3.eth.getTransactionCount(config.account);
        return nonce;
    }

    /**
     * 改变以太坊状态并查询gas
     * @param id
     * @param name
     * @param content
     * @param notefun
     * @returns {*}
     */
    addUpdateNote(id, name, content, notefun) {
        // var estimateGas = this.web3.eth.estimateGas({
        //     to: this.contractAddress,
        //     data: notefun
        // });
        // estimateGas = this.web3.utils.toHex(estimateGas);
        var nonce = global.getNextNonce();
        const privateKey = Buffer.from(config.privateKey,
            'hex');
        //交易对象
        var rawTx = {
            nonce: nonce,
            gasPrice: this.web3.utils.toHex('10000000000'),
            gasLimit: this.web3.utils.toHex('3000000'),
            to: this.contractAddress,
            value: '0x00',
            data: notefun,
            chainId: 4
        };
        var tx = new EthereumTx(rawTx ,{ chain: 'rinkeby' });
        tx.sign(privateKey);
        var serializedTx = tx.serialize();
        return this.web3.eth.sendSignedTransaction('0x' +
            serializedTx.toString('hex'));
    }

    /**
     * 添加笔记
     * @param id 用户id
     * @param name 文章标题
     * @param content 文章内容
     * @returns {*}
     */
    addNote(id, name, content) {
        var addNote = this.contract.methods.addNote(id, name, content).encodeABI();
        return this.addUpdateNote(id, name, content, addNote);
    }

    /**
     * 更新笔记
     * @param id 用户id
     * @param name 文章标题
     * @param content 文章内容
     * @returns {*}
     */
    updateNote(id, name, content) {
        var updateNote = this.contract.methods.updateNote(
            id, name, content).encodeABI();
        // return this.addUpdateNote(id, name, content, updateNote);
    }

}

var database = new Database();
function initGlobal(nonce) {
    global.nonce = --nonce;
    global.getNextNonce = function () {
        global.nonce++;
        return '0x' + global.nonce.toString(16);
    }
}
database.getNonce().then((res) => {
    initGlobal(res);
    test();
},
(err) => {
    initGlobal(0);
    console.log(err);
});

function test() {
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
 {
  blockHash: '0x7d4a156058a00763ec7e04d66cf18e925645ad4379b0bc0dc91b548dc55844a0',
  blockNumber: 7922497,
  contractAddress: null,
  cumulativeGasUsed: 764939,
  from: '0xd3200bd844fe4380d296df4ae39904433b973c8e',
  gasUsed: 48235,
  logs: [],
  logsBloom: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000',
  status: true,
  to: '0x1e97bfc3b4107ca1ba31b030931cafa381e238d5',
  transactionHash: '0xd0920d335a4634141c5b2b02c241a589a480bd28017553c1aab88536948a2648',
  transactionIndex: 4
}
**/
