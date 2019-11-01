const chalk = require('chalk');

const pkg = require('../utils/pkg-json.js');
// const logger = require('../utils/logger');
const generageInfo = require('../lib/generateInfo.js');


module.exports = (cwd) => {
    const pkgJson = pkg.getPkgJson(cwd);
    const configInfo = {};
    generageInfo(pkgJson.name, cwd, configInfo)
        .then(() => {
            console.log(chalk.cyan('Success! component db generated'));
            console.log();
            console.log('The build folder is ready to be deployed.');
            console.log();
        })
};