'use strict';

class checkJson {
    constructor(json) {
        if (this.isObject(json)) {
            this.json = json;
        } else
            throw new Error("this is not object");
    }

    isObject(obj) {
        return '[object Object]' === Object.prototype.toString.call(obj);
    }

    checkNullOrEmpty(key) {
        if (this.json[key] === "" || this.json[key] === undefined) {
            throw new Error(`${key}值不能为空！`);
        } else {
            return this.json[key];
        }
    }

    ReturnParam(...key_list) {
        let object = {};
        key_list.forEach((items) => {
            let key;
            let check;
            let match;
            [key, check, match] = items;
            key = key.trim();
            let handle = [
                () => {
                    this.json[key] ? object[key] = this.json[key] : null
                },
                () => {
                    object[key] = this.checkNullOrEmpty(key)
                }, () => {
                    object[key] = this.excludeSpecial(this.checkNullOrEmpty(key))
                }];
            if (handle[check]) {
                handle[check]();
            } else {
                object[key] = this.json[key] ? this.json[key] : null
            }
            if (match && object[key]) {
                let flag = object[key].match(match);
                if (!flag) {
                    throw new Error(`${key}格式错误！`);
                }
            }
        });
        return object;
    }

    excludeSpecial(str) {
        let str1 = str.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');// 去掉转义字符
        let str2 = str.replace(/[\@\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>\?]/g, '');// 去掉特殊字符
        return str2;
    };

    checkIsExists(key) {
        return !(this.json[key] === null || this.json[key] === undefined)
    }
}

module.exports = checkJson;
