let ErrorCodeDefine = {
    Success: {errcode: "0000", errmsg: "操作成功"},
    Failure: {errcode: "1000", errmsg: "操作失败"},
    ParamError: {errcode: "1001", errmsg: "缺少参数/参数格式错误"},
    BizParamError: {errcode: "1002", errmsg: "业务参数异常"},
    //Auth
    AuthError: {errcode: "2000", errmsg: "接口授权信息异常"},
    PermissionError: {errcode: "2001", errmsg: "权限不足"},
    TokenError: {errcode: "2002", errmsg: "token异常"},
    SignatureError: {errcode: "2003", errmsg: "signature异常"},
    //补充异常
    DBError: {errcode: "3001", errmsg: "数据库异常"},
    OutsideApiError: {errcode: "4001", errmsg: "外部接口访问异常"},
    //Other
    OtherError: {errcode: "9999", errmsg: "其他异常"},
};

let ActionCodeDefine = {
    IN: "IN",
    ParamCheck: "ParamCheck",
    CodeRunning: "CodeRunning",
    DBRunning: "DBRunning",
    OUT: "OUT",
};

class writeLog {
    constructor(req, res, log) {
        this.request = req;
        this.response = res;
        this.ResponseJSON = (errCode, err, resContent) => {
            let json = {
                head: {
                    rtnCode: errCode.errcode,
                    rtnMsg: errCode.errmsg,
                    rtnDesc: err ? err.message : "",
                }
            };
            if (resContent) {
                json.body = resContent
            }
            return json;
        };
        this.ActionFuncDefine = {
            Other: (errCode, err) => {
                log.writeDebug(`${this.request.originalUrl} Other ${err.message}`)
            },
            IN: () => {
                log.writeInfo(`${this.request.originalUrl} IN ${JSON.stringify(req.method === "GET" ? req.query : req.body)}`);
            },
            ParamCheck: (errCode, err) => {
                log.writeErr(`${this.request.originalUrl} ParamCheck ${err.message}`);
                this.response.json(this.ResponseJSON(errCode, err));
                return this.response.end();
            },
            CodeRunning: (errCode, err) => {
                log.writeErr(`${this.request.originalUrl} CodeRunning ${err.message}`);
                this.response.json(this.ResponseJSON(errCode, err));
                return this.response.end();
            },
            DBRunning: (errCode, err) => {
                log.writeErr(`${this.request.originalUrl} DBRunning ${err.message}`);
                this.response.json(this.ResponseJSON(errCode, err));
                return this.response.end();
            },
            OUT: (errCode, err, resContent) => {
                if (errCode.errcode === ErrorCodeDefine.Success.errcode)
                    log.writeInfo(`${this.request.originalUrl} OUT`);
                else
                    log.writeWarn(`${this.request.originalUrl} OUT`);
                this.response.json(this.ResponseJSON(errCode, err, resContent));
                return this.response.end();
            },
        };
    }

    //操作行为定义
    LogErrOrInfo(actionCode, errCode, err, resContent) {
        if (Object.prototype.toString.call(errCode) === "[object Object]" || errCode === undefined) {
            let ActionFunc = this.ActionFuncDefine[actionCode];
            if (ActionFunc)
                ActionFunc(errCode, err, resContent);
            else
                throw new Error('actionCode is not exist!');
        } else
            throw new Error('errCode is not Object! ')
    }
}

module.exports.ErrorCode = ErrorCodeDefine;
module.exports.ActionCode = ActionCodeDefine;

module.exports.writeLog = writeLog;
