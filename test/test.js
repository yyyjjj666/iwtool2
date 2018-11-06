let tool = require('../src/index');

let check = new tool.checkParam({mobile: "13773242411"});
try {
    check.ReturnParam(["mobile", 1, /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/]);
} catch (err) {
    console.log(err.message);
}


