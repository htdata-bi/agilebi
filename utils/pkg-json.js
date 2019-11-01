const path = require('path');
const fs = require('fs');
const logger = require('./logger.js');



const getJSON = (jsonPath) => {
    if(!fs.existsSync(jsonPath)) {
        logger.fatal('getJSON: %s not exists', jsonPath);
    }
    const jsonString = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(jsonString);
};

const getPkgJson = (cwd) => {
    const pkgPath = path.join(cwd, './package.json');
    return getJSON(pkgPath);
};

module.exports = {
    getPkgJson,
    getJSON
};