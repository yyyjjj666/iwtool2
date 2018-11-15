let tool = require('../src/index');


let mysql = new tool.mysqlHelper({
    username: 'edu',
    password: 'edu_123456',
    database: 'edu_system',
    host: "47.92.91.50",
    port: '700',
    dialect: 'mysql',
}, null);

let a=(id) => { return mysql.Query(`SELECT * FROM \`app_user\` WHERE id='${id}'`);};
 a(1);


