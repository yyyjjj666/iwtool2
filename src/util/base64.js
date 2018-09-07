'use strict';

let base64_opr = {

    StrToBase64: (Str) => {
        let buffer = new Buffer(Str);
        return buffer.toString('base64');
    },

    Base64ToStr: (Str) => {
        let buffer = new Buffer(Str, 'base64');
        return buffer.toString();
    }
}

module.exports = base64_opr;