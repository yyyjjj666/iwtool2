const axios = require('axios');
let qs = require('querystring');


let func = {
    formPost: (url, param, headers) => {
        let option = {
            method: "post",
            url: url,
            data: qs.stringify(param),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }
        if (headers)
            for (let key in headers) {
                option.headers[key] = headers[key];
            }
        return axios(option);
    },
    postParam: (url, param, headers) => {
        let option = {
            method: "post",
            url: url,
            data: param
        }
        if (headers)
            for (let key in headers) {
                option.headers[key] = headers[key];
            }
        return axios(option);
    },
    getParam: (url, headers) => {
        let option = {
            method: "get",
            url: url
        }
        if (headers)
            for (let key in headers) {
                option.headers[key] = headers[key];
            }
        return axios(option);
    }
}

module.exports = func;
