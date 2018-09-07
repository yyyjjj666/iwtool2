let arrayOpr = {

    //交集
    intersect: (a, b) => a.filter(v => b.includes(v)),

    //差集
    difference: (a, b) => a.concat(b).filter(v => a.includes(v) && !b.includes(v)),

    //合集
    union: (a, b) => Array.from(new Set([...a, ...b]))
};

module.exports = arrayOpr;