const path = require('path');
const fse = require('fs-extra');
const request = require('request');
const zlib = require('zlib');
const tar = require('tar');
const {
    getNpmRegistry, getLatestVersion,
  } = require('ice-npm-utils');

const downloadAndFilerNpmFiles = (npm, version, destDir) => {
    return new Promise((resolve, reject) => {
        const taskComplete = {
          // foo: false
        };
        function end() {
          const isDone = Object.values(taskComplete).every((done) => done === true);
    
          if (isDone) {
            resolve();
          }
        }
    
        const npmTarball = `${getNpmRegistry(npm)}/${npm}/-/${npm}-${version}.tgz`;

        taskComplete.entryPipe = false;
        request
          .get(npmTarball)
          .on('error', (err) => {
            reject(err);
          })
          .pipe(zlib.Unzip())
          .pipe(new tar.Parse())
          .on('entry', (entry) => {
            const templatePathReg = new RegExp('(package\/template\/)');
    
            let realPath;
            let destPath;
            if (templatePathReg.test(entry.path)) {
              realPath = entry.path.replace(templatePathReg, '');
              destPath = path.join(destDir, 'template', realPath);
            } else {
              realPath = entry.path.replace('package/', '');
              destPath = path.join(destDir, realPath);
            }
    
            fse.ensureDirSync(path.dirname(destPath));
            taskComplete[destPath] = false;
            entry.pipe(fse.createWriteStream(destPath)).on('close', () => {
              taskComplete[destPath] = true;
              end();
            });
          })
          .on('end', () => {
            taskComplete.entryPipe = true;
            end();
          });
      });
};
module.exports = ({templete, tempPath}) => {
  return getLatestVersion(templete).then((npmVersion) => {
    return downloadAndFilerNpmFiles(templete, npmVersion, tempPath)
  });
}