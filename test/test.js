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
// let connStr = 'mongodb://username:password@ip:port/db';
// let mongoHelper = new tool.mongoHelper(connStr, log);
//
// mongoHelper.Schame({
//     ddcAppID: String,
//     ddcAppKey: String,
//     ddcAppName: String,
//     createdAt: String,
// }, "auth_config");
//
// let Model = mongoHelper.Model;
// Model.find({ddcAppID: "xxx"}).then(res => {
//     console.log(res);
// });
try {
    let param_check = new tool.checkParam({mobile: "15311223456", email: "123456@vip.qq.com", phone: "0564-1233455"});
    let param = param_check.ReturnParam(["mobile ", 0, /^1(3|4|5|7|8)\d{9}$/], ["email", 1, /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/], ["name"], ["phone", 0, /0\d{2,3}-\d{7,8}/]);
    console.dir(param);
} catch (e) {
    console.log(e.message);
}
