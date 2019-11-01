const path = require('path');

const ora = require('ora');
const axios = require('axios');
const chalk = require('chalk');

const {getJSON} = require('../utils/pkg-json.js');
const Base64ToAscii = require('../utils/Base64ToAscii.js');
const {uploadDbHost} = require('../config/devEnv.js');
const {uploadDbAip} = require('../config/apiPath.js');

const getDBStr = (cwd) => {
    const filePath = path.join(cwd, 'build/info.json');
    return getJSON(filePath);
};

const updataDB = async (DB, site) => {
    const url = `${site}${uploadDbAip}`;
    const spinner = ora(`DB sync to platform now`)
    await axios({
        method: 'post',
        url,
        data: DB
    }).then(res => {
        if(res.data && res.data.code === 200) {
            spinner.succeed(chalk.green(`DB update succ`));
        } else {
            spinner.fail(`DB update fail`);
        }

    }).catch((err) => {
        spinner.fail(chalk.red(`DB update fail: ${err}`));
    })
};

module.exports = async (cwd, options) => {
    let host = options.host || Base64ToAscii(uploadDbHost);
    const DBStr = getDBStr(cwd);
    updataDB(DBStr, host);
};