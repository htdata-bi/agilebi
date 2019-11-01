const fse = require('fs-extra');
const path = require('path');
module.exports = (dir, files) => {
    Object.keys(files).forEach((name) => {
        const filePath = path.join(dir, name);
        fse.ensureDirSync(dir);
        fse.writeFileSync(filePath, files[name]);
    });
};