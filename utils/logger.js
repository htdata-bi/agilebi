const chalk = require('chalk');
const { format } = require('util');

const prefix = '  ty-clitool';
const sep = chalk.gray('.');

const fatal = (...args) => {
    if (args[0] instanceof Error) {
        args[0] = args[0].message.trim();
    }
    const msg = format(...args);
    console.log();
    console.error(chalk.red(prefix), sep, msg);
    console.log();
    process.exit(1);
}

const info = (...args) => {
    const msg = format(...args);
    console.log(chalk.green(prefix), sep, msg);
}

module.exports = {
    fatal,
    info
};