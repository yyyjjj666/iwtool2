const sequelize = require('sequelize');
const replaceall = require("replaceall");
const async = require('async');

const pg = require('pg');//PostgreSQL
const mysql = require('mysql');//MySQL

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

let default_log = require('./default_log');

class DBHelper {
    constructor(conf, log) {
        try {
            if (log !== undefined && log !== null) {
                default_log = log;
            }
            this.Sequelize = new sequelize(conf.database, conf.username, conf.password, {
                host: conf.host,
                dialect: conf.dialect,
                port: conf.port,
                timezone: "+08:00",
                logging: (sql) => default_log.writeDebug(`DB ${sql}`),//用于Sequelize日志打印的函数
                pool: {
                    max: 10,
                    min: 0,
                    idle: 10000
                }
            });
        } catch (err) {
            default_log.writeErr(`${err.message}`);
            throw new Error(err);
        }
    }

    Add(sql, obj) {
        return this.excuteSql(sql, obj, (a) => a[1] > 0);
    }

    Update(sql, obj) {
        return this.excuteSql(sql, obj, (a) => a[0].affectedRows > 0);
    }

    excuteSql(sql, obj, fn) {
        return new Promise((resolve, reject) => {
            sql = obj ? RebuildSql(sql, obj) : sql;
            this.Sequelize.query(sql).then((result) => {
                resolve(fn(result));
            }).catch((err) => {
                default_log.writeErr(`${err.message}`);
                reject(err);
            })
        });
    }

    Query(sql, obj) {
        return this.excuteSql(sql, obj, (a) => a[0]);
    }

    QuerySingle(sql, obj) {
        return this.excuteSql(sql, obj, (a) => a.length ? a[0][0] : null);
    }

    QueryProcedure(sql, obj) {
        return this.excuteSql(sql, obj, (a) => a);
    }
}

class MySQL extends DBHelper {
    constructor(conf, log) {
        super(conf, log);
        this.conf = conf;
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

class PostgreSQL extends DBHelper {
    constructor(conf, log) {
        super(conf, log);
    }

    Update(sql, obj) {
        return this.excuteSql(sql, obj, (a) => a[1].rowCount > 0);
    }
}


module.exports = {
    MySQL, PostgreSQL
};
