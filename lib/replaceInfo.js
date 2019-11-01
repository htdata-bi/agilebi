const writeFileTree = require('../utils/wirteFileTree.js');
const {getPkgJson} = require('../utils/pkg-json.js');
module.exports = (Info, dir) => {
    let jsonObj = getPkgJson(dir);
    Object.keys(Info).forEach(name => {
        jsonObj[name] = Info[name]
    });
    writeFileTree(dir, {
        'package.json': JSON.stringify(jsonObj, null, 2)
    });
};