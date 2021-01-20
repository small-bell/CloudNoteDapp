//结果统一处理类
const {
    ERR_CODE,
    SUCC_CODE
} = require('../utils/constant');

/**
 * 构造函数零个参数： 只有msg
 *         一个参数： 指定msg
 *         两个参数： 指定data和msg
 *         三个+参数： 指定options
 *         addItem: 在data中添加数据,可以级联使用
 *              例如new Result().addItem({}).addItem({}).success()
 */
class Result {

    constructor(data, msg='操作成功', options) {
        if (arguments.length === 0) {
            this.msg = '操作成功';
        } else if (arguments.length === 1){
            this.msg = data;
        } else {
            this.data = data;
            this.msg = msg;
            if (options) {
                this.options = options;
            }
        }
    }

    json() {
        return this.createResult();
    }

    createResult() {
        if (!this.code) {
            this.code = SUCC_CODE;
        }
        let base = {
            code: this.code,
            msg: this.msg
        };
        if (this.data) {
            base.data = this.data;
        }
        if (this.options) {
            base = {...base, ...this.options};
        }
        return base;
    }

    success() {
        this.code = SUCC_CODE;
        return this.json();
    }

    fail() {
        this.code = ERR_CODE;
        return this.json();
    }

    addItem(item) {
        this.data = {...this.data, ...item};
        return this;
    }
}

module.exports = Result;
