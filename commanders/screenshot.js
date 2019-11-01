const path = require('path');

const ora = require('ora');

const loadCommand = require('../utils/loadCommand.js');
const creatTempath = require('../utils/creatTempath.js');
const screenShot = require('../utils/screenShot.js');
const logger = require('../utils/logger.js');

module.exports = async (cwd) => {
    const spin = ora('screenshoting ...');
    spin.start();
    const args = {
        port: 9989,
        entry: cwd,         
        isBrowser: false
    };
    const server = await loadCommand('serve', 'ty-cli-server').createDevServer(args);
    await server.start();
    const url = `http://localhost:${args.port}/`
    const temPath = creatTempath(cwd);
    const screenshotingTemPath = path.join(temPath, 'screenshot.png');
    const selecter = '.widgetContent';
    try {
        await screenShot(url, selecter, screenshotingTemPath);
        spin.succeed('generate screenshot.png sucesss');
        spin.stop();
    } catch(error) {
        spin.fail('generate screenshot.png fail');
        spin.stop();
        logger.fatal(error)
    } finally {
        server.close();
    }

}