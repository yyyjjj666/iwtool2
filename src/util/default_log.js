const color = require('colors-cli/safe');
module.exports = {
    writeDebug: (a) => console.log(`${color.green.bold(a)}`),
    writeErr: (a) => console.log(`${color.red.bold(a)}`),
    writeInfo: (a) => console.log(`${color.cyan.bold(a)}`),
    writeWarn: (a) => console.log(`${color.yellow.bold(a)}`)
};