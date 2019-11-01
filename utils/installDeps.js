const supportPackageManagerList = ['npm', 'yarn', 'pnpm'];
const registries = {
    npm: 'https://registry.npmjs.org',
    yarn: 'https://registry.yarnpkg.com',
    taobao: 'https://registry.npm.taobao.org',
    pnpm: 'https://registry.npmjs.org'
};
const spawn = require('cross-spawn');
const ora = require('ora');
const checkPackageManagerIsSupported  = (command) => {
    if (supportPackageManagerList.indexOf(command) === -1) {
        throw new Error(`Unknown package manager: ${command}`)
    }
};
const excuteCommand = (command, targetDir, args) => {
    spawn.sync(command, args, {
        cwd: targetDir
    }, { stdio: 'inherit' });
};
exports.installDeps =  (targetDir, command = 'npm', cliRegistry = 'https://registry.npm.taobao.org') => {
    const spinner = ora({
        text: 'Installing dependens',
        color: 'yellow'
    });
    spinner.start();
    checkPackageManagerIsSupported(command);
    const args = [];
    // TODO 验证
    args.push('install', `--registry=${cliRegistry}`);
    excuteCommand(command, targetDir, args);
    spinner.succeed('install dependens succ!');
}