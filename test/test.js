let tool = require('../src/index');
let path = require('path');
let logConf = {
    app_id: "x",
    path: path.dirname(__dirname, '.'),//日志根目录
    level: 4,//日志级别
    isRemote: false//是否开启远程日志
};


//日志
let log = new tool.logHelper(logConf.path, logConf.app_id, logConf.level, logConf.isRemote);


let mysqlFunc = new tool.mysqlHelper({
    username: 'root',
    password: '1234',
    database: 'gy_sst',
    host: "localhost",
    port: '3306',
    dialect: 'mysql',
}, log);

mysqlFunc.Add(`INSERT INTO test (\`name\`) VALUES (@test)`, {test: 111});

let list = [];
list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "1"}]);
list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "2"}]);
list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "3"}, (a) => a.affectedRows > 0]);
list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "4"}]);
list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "5"}]);
/*
* add a.affectedRows > 0
* update a.changedRows>0
* */

mysqlFunc.Transaction(list, (err, result) => {
    if (err) console.log(err.message);
    console.log(result);
});
