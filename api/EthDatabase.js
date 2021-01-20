var Web3 = require('web3');
var fs = require('fs');
const EthereumTx = require('ethereumjs-tx').Transaction
var config = require('../config/config');

class EthDatabase {
    /**
     * 初始化web3客户端
     */
    constructor() {
        this.contractAddress = config.contractAddress;
        this.gasPrice = config.gasPrice;
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.infuraHttps));
        this.web3.eth.defaultAccount = config.account;
        //注意在测试文件和app.js文件中路径不一样
        this.abi = JSON.parse(fs.readFileSync(
            './contract/CloudNoteService_sol_CloudNoteService.abi'
        ).toString());
        this.contract = new this.web3.eth.Contract(this.abi,this.contractAddress);
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
        // var nonce = global.getNextNonce();
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
        return this.addUpdateNote(id, name, content, updateNote);
    }

    /**
     * 根据用户ID和标题获取笔记内容
     * @param id 用户ID
     * @param name 标题
     * @returns {*}
     */
    getNote(id, name) {
        var getNote = this.contract.methods
            .getNote(id, name).encodeABI();
        var _that = this;
        return new Promise(function (resolve, reject) {
            _that.web3.eth.call({
                to: _that.contractAddress,
                data: getNote
            }).then((res) => {
                var result =  _that.web3.eth.abi.decodeParameter('string', res);
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });
    }

    /**
     * 查询交易状态
     * @param hash
     * @returns {null|number} 1：成功，0：失败，null：未处理
     */
    queryTransactionStatus(hash) {
        var _that = this;
        return new Promise((resolve, reject) => {
            _that.web3.eth.getTransactionReceipt(hash)
                .then((res) => {
                    resolve(res);
                });
        });
    }

}

module.exports = EthDatabase;
