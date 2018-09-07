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
            let item = "";
            let key = "";
            let check = 0;
            switch (items.length) {
                case 1:
                    [item] = items;
                    item = key = item.trim();
                    break;
                case 2:
                    switch (typeof (items[1])) {
                        case typeof (0):
                            [item, check] = items;
                            item = key = item.trim();
                            break;
                        default:
                            [item, key] = items;
                            item = item.trim();
                            key = key.trim();
                            break;
                    }
                    break;
                case 3:
                    [item, key, check] = items;
                    item = item.trim();
                    key = key.trim();
                    break;
                default:
                    throw new Error(`${items}格式错误！`);
            }
            switch (check) {
                case 0://不查空，不过滤
                    object[key] = this.json[item];
                    break;
                case 1://查空，不过滤
                    object[key] = this.checkNullOrEmpty(item);
                    break;
                case 2://查空，过滤
                    object[key] = this.checkNullOrEmpty(item);
                    object[key] = this.excludeSpecial(object[key]);
                    if (object[key] === "") {
                        throw new Error(`${item}值不能为空！`);
                    }
                    break;
                default://不查空，不过滤
                    if (this.json[key]) {
                        object[key] = null;
                    } else
                        object[key] = this.json[item];
                    break;
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