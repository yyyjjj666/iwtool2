const mysql = require('mysql');
const sequelize = require('sequelize');
const replaceall = require("replaceall");
const async = require('async');

const color = require('colors-cli/safe');

class myHelper {
    constructor(conf, log) {
        if (log !== undefined && log !== null) {
            default_log = log;
        }
        this.conf = conf;
        this.Sequelize = new sequelize(conf.database, conf.username, conf.password, {
            host: conf.host,
            dialect: conf.dialect,
            port: conf.port,
            timezone: "+08:00",
            logging: (sql) => default_log.writeDebug(`DB ${sql}`),//用于Sequelize日志打印的函数
            pool: {
                max: 10,
                min: 0,
                idle: 10000,
                benchmark: true//在打印执行的SQL日志时输出执行时间（毫秒）
            }
        });

    }

    Add(sql, obj) {
        return new Promise((resolve, reject) => {
            if (obj)
                sql = RebuildSql(sql, obj);
            this.Sequelize.query(sql).then((result) => {
                resolve(result[1] > 0);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    Update(sql, obj) {
        return new Promise((resolve, reject) => {
            if (obj)
                sql = RebuildSql(sql, obj);
            this.Sequelize.query(sql).then((result) => {
                resolve(result[0]["affectedRows"] > 0);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    Query(sql, obj) {
        return new Promise((resolve, reject) => {
            if (obj)
                sql = RebuildSql(sql, obj);
            this.Sequelize.query(sql).then((result) => {
                resolve(result[0]);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    QuerySingle(sql, obj) {
        return new Promise((resolve, reject) => {
            if (obj)
                sql = RebuildSql(sql, obj);
            this.Sequelize.query(sql).then((result) => {
                if (result.length)
                    resolve(result[0][0]);
                else
                    resolve(null);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    QueryProcedure(sql, obj) {
        return new Promise((resolve, reject) => {
            if (obj)
                sql = RebuildSql(sql, obj);
            this.Sequelize.query(sql).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    Transaction(list, callback) {
        try {
            let now_conf = {
                host: this.conf.host,
                user: this.conf.username,
                password: this.conf.password,
                database: this.conf.database,
                connectionLimit: 10,
                port: this.conf.port,
                waitForConnections: false
            };
            let pool = mysql.createPool(now_conf);
            pool.getConnection(function (err, connection) {
                if (err) {
                    return callback(err, null);
                }
                connection.beginTransaction(function (err) {
                    if (err) {
                        return callback(err, null);
                    }
                    default_log.writeDebug(`DB 开始执行transaction,共执行${list.length}条`);
                    let funcAry = [];
                    list.forEach((item, index) => {
                        let sql, obj, checkFunc;
                        [sql, obj, checkFunc] = [...item];
                        sql = RebuildSql(sql, obj);
                        default_log.writeDebug(`DB ${sql}`);
                        let temp = function (cb) {
                            connection.query(sql, (tErr, results, fields) => {
                                if (tErr) {
                                    connection.rollback(function () {
                                        default_log.writeErr("执行事务失败," + sql + ",ERROR：" + tErr);
                                        let err = new Error("执行事务失败," + sql + ",ERROR：" + tErr);
                                        err.code = "PARSER_TRANS_ERROR";
                                        throw  err;
                                    });
                                } else {
                                    if (typeof checkFunc === "function")
                                        if (!checkFunc(results)) {
                                            default_log.writeErr("执行事务失败," + sql + ",不符合要求");
                                            let err = new Error("执行事务失败," + sql + ",不符合要求");
                                            err.code = "PARSER_TRANS_ERROR";
                                            throw  err;
                                        }
                                    return cb(null, 'ok');
                                }
                            })
                        };
                        funcAry.push(temp);
                    });

                    async.series(funcAry, function (err, result) {
                        if (err) {
                            connection.rollback(function (err) {
                                default_log.writeErr("transaction error: " + err);
                                connection.release();
                                return callback(err, null);
                            });
                        } else {
                            connection.commit(function (err, info) {
                                if (err) {
                                    default_log.writeErr("执行事务失败," + err);
                                    connection.rollback(function (err) {
                                        default_log.writeErr("transaction error: " + err);
                                        connection.release();
                                        return callback(err, null);
                                    });
                                } else {
                                    connection.release();
                                    return callback(null, info);
                                }
                            })
                        }
                    })
                });
            });
        } catch (err) {
            err.code = "PARSER_ERROR";
            throw  err;
        }
    }

}

let default_log = {
    writeDebug: (a) => console.log(`${color.green.bold(a)}`),
    writeErr: (a) => console.log(`${color.red.bold(a)}`),
    writeInfo: (a) => console.log(`${color.cyan.bold(a)}`),
    writeWarn: (a) => console.log(`${color.yellow.bold(a)}`)
};

let RebuildSql = (sql, obj) => {
    let keys = Object.keys(obj).sort((a, b) => (b.length - a.length));
    let type = ['[object String]', '[object Object]', '[object Array]', '[object Undefined]', '[object Null]'];
    let func = [
        (obj, key) => replaceKey(obj, key, sql),
        (obj, key) => replaceKeyJSON(obj, key, sql),
        (obj, key) => replaceKeyJSON(obj, key, sql),
        (obj, key) => replaceKeyNull(obj, key, sql),
        (obj, key) => replaceKeyNull(obj, key, sql)];
    for (let key of keys) {
        let index = type.indexOf(Object.prototype.toString.call(obj[key]));
        if (index !== -1) {
            sql = func[index](obj, key);
        } else {
            sql = replaceKey(obj, key, sql);
        }
    }
    return sql;
};

let replaceKey = (obj, key, sql) => {
    sql = replaceall(`@${key},`, `'${obj[key]}',`, sql);
    sql = replaceall(`@${key}`, `'${obj[key]}'`, sql);
    return sql;
};
let replaceKeyNull = (obj, key, sql) => {
    sql = replaceall(`@${key},`, `NULL,`, sql);
    sql = replaceall(`@${key}`, `NULL`, sql);
    return sql;
};
let replaceKeyJSON = (obj, key, sql) => {
    sql = replaceall(`@${key},`, `'${JSON.stringify(obj[key])}',`, sql);
    sql = replaceall(`@${key}`, `'${JSON.stringify(obj[key])}'`, sql);
    return sql;
};

module.exports = myHelper;
