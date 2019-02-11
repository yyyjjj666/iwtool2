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
    },
    add(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
    },
    sub(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
    },
    mul(a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {
        }
        try {
            c += e.split(".")[1].length;
        } catch (f) {
        }
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    },
    div(a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {
        }
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {
        }
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
    },
};
