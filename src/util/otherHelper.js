module.exports = {
    prefixInteger: (num, n) => {
        return (Array(n).join(0) + num).slice(-n);
    },
    base64: {
        StrToBase64: (Str) => {
            let buffer = new Buffer(Str);
            return buffer.toString('base64');
        },

        Base64ToStr: (Str) => {
            let buffer = new Buffer(Str, 'base64');
            return buffer.toString();
        },
    },
    arrayOpr: {
        //交集
        intersect: (a, b) => a.filter(v => b.includes(v)),
        //差集
        difference: (a, b) => a.concat(b).filter(v => a.includes(v) && !b.includes(v)),
        //合集
        union: (a, b) => Array.from(new Set([...a, ...b]))
    }
};
