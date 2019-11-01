const path = require('path');
const fse = require('fs-extra');
module.exports = (cwd) => {
    const temPath = path.join(cwd, 'tmp');
    if (!fse.existsSync(temPath)) {
        fse.mkdirSync(temPath);
    }
    return temPath;
}