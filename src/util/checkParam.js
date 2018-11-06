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
            let key = "";
            let check = 0;
            let match;
            switch (items.length) {
                case 1:
                    [key] = items;
                    key = key.trim();
                    break;
                case 2:
                    [key, check] = items;
                    key = key.trim();
                    break;
                case 3:
                    [key, check, match] = items;
                    key = key.trim();
                    break;
                default:
                    throw new Error(`${items}格式错误！`);
            }
            switch (check) {
                case 0://不查空，不过滤
                    object[key] = this.json[key];
                    break;
                case 1://查空，不过滤
                    object[key] = this.checkNullOrEmpty(key);
                    break;
                case 2://查空，过滤
                    object[key] = this.checkNullOrEmpty(key);
                    object[key] = this.excludeSpecial(object[key]);
                    if (object[key] === "") {
                        throw new Error(`${key}值不能为空！`);
                    }
                    break;
                default://不查空，不过滤
                    if (this.json[key]) {
                        object[key] = null;
                    } else
                        object[key] = this.json[key];
                    break;
            }
            if (match) {
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
