let tool = require('../src/index');

var a = [1, 2, 3, 4];
var b = [3, 4, 5, 6];
console.log(a, b);
try {
    console.log('交集', tool.array_opr.intersect(a, b));
    console.log('差集', tool.array_opr.difference(a, b));
    console.log('并集', tool.array_opr.union(a, b));
} catch (err) {
    console.log(err.message);
}

// tool.request_axios.getParam('https://fuju.doggadatachina.com/organization/get_org_list').then(result=>{
//     console.log(result.data);
// })

let path = require('path');
let logConf = {
    app_id: "mini",
    path: path.dirname(__dirname, '.'),//日志根目录
    level: 4,//日志级别
    isRemote: false//是否开启远程日志
};
//日志
let log = new tool.logHelper(logConf.path, logConf.app_id, logConf.level, logConf.isRemote);

let mysql = new tool.mysqlHelper({
    username: 'edu',
    password: 'edu_1234',
    database: 'edu_system',
    host: "39.106.27.231",
    port: '703',
    dialect: 'mysql'
}, log);

mysql.Add("INSERT INTO course_version (id,c_id) VALUES (@id,@c_id);", {
    id: "7",
    c_id: {a:1}
}).then(res => {
    console.log(res);
}).catch(err=>console.log(err));
