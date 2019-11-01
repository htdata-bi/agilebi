const path = require('path');
const loadCommand = require('../utils/loadCommand.js');
module.exports = (...args) => {
    const entry = process.cwd();
    loadCommand('serve', 'ty-cli-server').createDevServer({entry}).start();
};