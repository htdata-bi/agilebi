const chalk = require('chalk');
const { getNpmInfo } = require('ice-npm-utils');
const logger = require('./logger.js');

const getNpmTimeInfo = (npm, version = 'latest') => {
    return getNpmInfo(npm)
        .then(data => {
            if(!data.time) {
                console.error(chalk.red('time not exit in package'));
                logger.fatal(new Error(`${npm}@${version} time not exsit`));
            }
            version = data['dist-tags'] && data['dist-tags'][version] || version;
            const { versions } = data;
            if (!versions || versions[version] === undefined) {
                logger.fatal(new Error(`${npm}@${version} not publish!`))
            }
            return data.time
        })
};

module.exports = {
    getNpmTimeInfo
};