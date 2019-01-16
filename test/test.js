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
let connStr = 'mongodb://username:password@ip:port/db';
let mongoHelper = new tool.mongoHelper(connStr, log);

mongoHelper.Schame({
    ddcAppID: String,
    ddcAppKey: String,
    ddcAppName: String,
    createdAt: String,
}, "auth_config");

let Model = mongoHelper.Model;
Model.find({ddcAppID: "xxx"}).then(res => {
    console.log(res);
});

