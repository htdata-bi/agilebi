const logger = require('./logger.js');
const isNotFoundError = (err, commandName) => {
    const reg =new RegExp(commandName)
    return err.message.match(/Cannot find module/)  && reg.test(err.message);
};
module.exports = (commandName, moduleName) => {
    try {
        return require(moduleName);
    } catch (err1) {
        if (isNotFoundError(err1, commandName)) {
            try {
                return require('import-global')(moduleName);
            } catch(err2) {
                if(isNotFoundError(err2, commandName)) {
                    logger.fatal(`${commandName} ：${err2.message} `);
                } else {
                    throw err;
                }
            }
        } else {
            throw err1;
        }
    }
};