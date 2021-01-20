var sqlite3 = require('sqlite3').verbose();
var Promise = require('bluebird');
var fs = require('fs');

class Sqlite3 {
    constructor() {
        this.instance;
        this.db = null;
    }

    /**
     * 单例
     * @returns {*}
     */
    static getInstance() {
        this.instance = this.instance ? this.instance : new Sqlite3();
        return this.instance;
    }

    connect(path) {
        this.db = new sqlite3.Database(path);
        var exist = fs.existsSync(path);
        if(!exist){
            fs.openSync(path, 'w');
            console.log("Creating db file!");
        }
    }

    runSql(sql) {
        this.db.run(sql, function(err){
            if(null != err){
                console.log(err)
                console.log('sql error 执行失败')
            }
        });
    }

    insert(sql, objects) {
        var _that = this;
        this.db.serialize(function(){
            var stmt = _that.db.prepare(sql);
            if (objects instanceof Array){
                for(var i = 0; i < objects.length; ++i){
                    stmt.run(objects[i]);
                }
            } else {
                var form = [];
                for (let i in objects) {
                    form.push(objects[i]);
                }
                stmt.run(form);
            }
            stmt.finalize();
        });
    }

    query(sql, callback) {
        this.db.all(sql, function(err, rows){
            if(null != err){
                console.log("sql error 查询出错！");
                return;
            }

            if(callback){
                callback(rows);
            }
        });
    }

    close() {
        this.db.close();
    }

}

module.exports = Sqlite3;
