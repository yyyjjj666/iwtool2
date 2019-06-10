```
npm install --save it-walker-tool
```
## 日志组件
日志组件初始化有2个参数"日志根目录地址"和"日志等级",有四个方法 writeInfo,writeErr,writeWarn,writeDebug
日志组件产生文本日志，并输出展示到CLI，Info(蓝色) Err(红色) Warn(黄色) Debug(绿色)
```
日志等级为1 输出Err
日志等级为2 输出Info、Err
日志等级为3 输出Info、Err、Warn
日志等级为4 输出Info、Err、Warn、Debug
```

- 初始化
```
let path = require('path');
const logHelper = require('it-walker-tool').logHelper;
let log = new logHelper(path.dirname(__dirname, '.'), 4);

module.exports = {
    log: log
};
```
- 使用
```
log.writeErr(str);
```

## http 组件
```
postParam(url, param)
httpGet(url)
```

## redis操作组件
```
redis_get_key(db) 获取对应db所有键
redis_del(key,value) 删除对应键的值
redis_add(key, value) 向对应键添加值
redis_get(key) 获取对应键的所有值
 ```


## json参数判断组件
````
checkNullOrEmpty(json,key) 判断json对象对应key的值是否有效
checkIsExists(json,key) 判断json对象对应key的值是否存在
````

mongoDB
```
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
```

mysql 事务
```
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
```

```
1.5.1
新增 mongoDBHelper
```
```
let newLog = new resDef.writeLog(req, res, log);
newLog.LogErrOrInfo(ActionCode.IN);
return newLog.LogErrOrInfo(ActionCode.ParamCheck, ErrorCode.ParamError, err);
return newLog.LogErrOrInfo(ActionCode.DBRunning, ErrorCode.DBError, err);
return newLog.LogErrOrInfo(ActionCode.CodeRunning, ErrorCode.OtherError, err);
return newLog.LogErrOrInfo(ActionCode.OUT, ErrorCode.Success, null, {});
return newLog.LogErrOrInfo(ActionCode.OUT, ErrorCode.Failure, new Error('xxxx'), {});
```

|错误代号 | 错误描述|
|:---|:---|
|Success		|操作成功|
|Failure		|操作失败|
|ParamError		|缺少参数/参数格式错误|
|BizParamError	|	业务参数异常|
|AuthError		|接口授权信息异常|
|PermissionError|		权限不足|
|TokenError		|token异常|
|SignatureError	|	signature异常|
|DBError		|数据库异常|
|OutsideApiError|		外部接口访问异常|
|OtherError		|其他异常|

|行动代号 | 行动描述|
|:---|:---|
|IN|进入程序|
|ParamCheck|参数检查|
|CodeRunning|主程序运行|
|DBRunning|数据库程序执行|
|OUT|退出程序|
		

