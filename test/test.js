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


// let mysqlFunc = new tool.mysqlHelper({
//     username: 'root',
//     password: '1234',
//     database: 'gy_sst',
//     host: "localhost",
//     port: '3306',
//     dialect: 'mysql',
// }, log);
//
// let mysqlFunc2 = new tool.dbHelper.MySQL({
//     username: 'root',
//     password: '1234',
//     database: 'gy_sst',
//     host: "localhost",
//     port: '3306',
//     dialect: 'mysql',
// }, log);
//
// let PostgreSQL = new tool.dbHelper.PostgreSQL({
//     username: 'postgres',
//     password: '123456',
//     database: 'postgres',
//     host: "192.168.199.178",
//     port: '5432',
//     dialect: 'postgres',
// }, log);
// PostgreSQL.QuerySingle()
//
// mysqlFunc2.Add(`INSERT INTO test (\`name\`) VALUES (@test)`, {test: 111});
//
//
// mysqlFunc.Add(`INSERT INTO test (\`name\`) VALUES (@test)`, {test: 111});
//
// let list = [];
// list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "1"}]);
// list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "2"}]);
// list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "3"}, (a) => a.affectedRows > 0]);
// list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "4"}]);
// list.push([`INSERT INTO test (\`name\`) VALUES (@test)`, {test: "5"}]);
// /*
// * add a.affectedRows > 0
// * update a.changedRows>0
// * */
//
// mysqlFunc2.Transaction(list, (err, result) => {
//     if (err) console.log(err.message);
//     console.log(result);
// });


let mongo_conf = {
    "host": "192.168.199.178",
    "port": 725,
    "username": "mongo-admin",
    "password": "mongo-123-**",
    "database": "admin",
};

let mongo = new tool.mongoHelper(mongo_conf);
// mongo.QuerySingle('files', {id: "8f415df835e55c637f9f3a6f1efb636c"}, ["originalFilename", "id", "original_file"]).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.dir(err.message)
// });

mongo.Query('role_configs', {}, ["roleName"]).then(res => {
    console.log(res);
}).catch(err => {
    console.dir(err.message)
});

mongo.Delete('role_configs', {
    "roleID": "1e282f4c036d11e9a01700ff463e0da2"
}).then(res => {
    console.log(res);
}).catch(err => {
    console.dir(err.message)
});

// mongo.Add('role_configs', [{
//     "_id": "1e282f4c036d11e9a01700ff463e0dae",
//     "roleID": "1e282f4c036d11e9a01700ff463e0dae",
//     "roleName": "超级管理员",
//     "menu": [],
//     "while_list": []
// }, {
//     "_id": "1e282f4c036d11e9a01700ff463e0da2",
//     "roleID": "1e282f4c036d11e9a01700ff463e0dae",
//     "roleName": "超级管理员",
//     "menu": [],
//     "while_list": []
// }]).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.dir(err.message)
// });

// mongo.Collection('files').then(res => {
//     let collection, db;
//     [collection, db] = [...res];
//     db.close();
// }).catch(err => {
//     // console.dir(err.message)
// });