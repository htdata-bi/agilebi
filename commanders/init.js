const path = require('path');

const fse = require('fs-extra');
const inquirer = require('inquirer');
const validateNpmName = require('validate-npm-package-name');
const ora = require('ora');
const userHome = require('user-home');
const chalk = require('chalk');

const logger = require('../utils/logger.js');
const download = require('../utils/download.js');
const {installDeps} = require('../utils/installDeps.js');
const replaceInfo = require('../lib/replaceInfo.js');



const askInfo = async (options) => {
    const {name, description} = await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            meassge: 'appName',
            default: options.name
        },
        {
            name: 'description',
            type: 'input',
            meassge: 'description',
            default: 'This is a component'
        }
    ]);
    return {
        name,
        description
    }

};

const askOk = async () => {
    const {ok} = await inquirer.prompt([
        {
            name: 'ok',
            type: 'confirm',
            message: 'Generate project in current directory?'
        }
    ]);
    return {ok};
};

const askAction = async (targetDir) => {
    const {action} = await inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            meassge: `Target directory ${chalk.cyan(targetDir)} already exits. pick an action: `,
            choices: [
                {
                    name: 'overwrite', 
                    value: 'overwrite'
                },
                {
                    name: 'cancel',
                    value: 'cancel'
                }
            ]
        }
    ]);
    return {action};
};


const downloadTemplate = (templete) => {
    const spinner = ora('downloading template');
    spinner.start();

    const tempPath = path.join(userHome, '.ty-templeta', templete);
    if(fse.existsSync(tempPath)) {
        fse.removeSync(tempPath);
    }
    fse.ensureDirSync(tempPath);
    return download({templete, tempPath})
        .then(()=> {
            spinner.succeed('downloading template succ!');
            return tempPath
        })
        .catch(err => {
            spinner.fail('downloading template fail!');
            logger.fatal(`Failed to download repo ${templete} : ${err.stack}`);
        });
};

const initCompletedMessage = (appPath, appName) => {
    console.log();
    console.log(`Success! Created ${appName} at ${appPath}`);
    console.log('Inside that directory, you can run several commands:');
    console.log('ty serve: creat a local server for local develop');
    console.log('ty build: build static file for plateform')
    console.log('npm run upload: uplaod source code to plateform')
    console.log('Happy hacking!');
};

module.exports = async (cwd, projectName, options) => {
    // TODO 
    let template = process.env.TEMPLATE || 'ty-cli-template';

    const isCurrent = projectName === '.' 
    const name = isCurrent ? path.relative('../', cwd) : projectName;
    const targetDir = path.resolve(cwd, projectName || '.');

    const result = validateNpmName(name);
    if(!result.validForNewPackages) {
        logger.fatal('packageName %s  not valid', name);
    }


    if (fse.existsSync(targetDir)) {
        if (isCurrent) {
            const {ok} = await askOk();
            if (!ok) {return;}
        } else {
            const {action} = await askAction(targetDir);
            if (action === 'cancel') { return; }
            if (action == 'overwrite') {
                fse.remove(targetDir);
            }
        }
    } else {
        fse.ensureDirSync(targetDir);
    }

    const opt = {name};
    const answers = await askInfo(opt);

    const templatePath = await downloadTemplate(template);
    fse.copySync(templatePath, targetDir);
    replaceInfo(answers, targetDir);
    installDeps(targetDir);
    initCompletedMessage(targetDir, name);
}