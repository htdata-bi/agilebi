#!/usr/bin/env node
const semver = require('semver');
const chalk = require('chalk');
const program = require('commander');
const slash = require('slash');
const didYouMean = require('didyoumean');

const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');
const commandersConfig = require('../config/commanders.js');
const cleanArgs = require('../utils/cleanArgs.js');
const logger = require('../utils/logger.js');

const cwd = process.cwd();

function checkNodeVersion(versionRange, name) {
    if(!semver.satisfies(process.version, versionRange)) {
        console.log(
            chalk.red(
                `Your node version:${
                    process.version
                }
                but this version of${
                    name
                } require node ${
                    versionRange
                }.\n Please upgrade your Node version now
                `
            )
        );
        process.exit(1);
    }
}



function exec() {
    const requireVersion = packageJson.engines.node;
    const packageName = packageJson.name;
    checkNodeVersion(requireVersion, packageName);

    // enter debug mode
    if(
        slash(process.cwd()).indexOf('/test') !== -1 &&
        fs.existsSync(path.resolve(process.cwd(), '../bin/ty-clitool.js')) 
    ){
        process.env.CLI_DEBUG = true;
    }

    program.version(packageJson.version).usage('[command] [options]');

    Object.entries(commandersConfig).forEach((commanderConfig) => {
        let command = program
            .command(commanderConfig[1].mode)
            .description(chalk.green(commanderConfig[1].desc));

        if(commanderConfig[1].options) {
            commanderConfig[1].options.forEach((option) => {
                command = command.option(option.name, option.desc);
            });
        }

        command.action( (...temArgs) => {

            const commmandType = commanderConfig[0];
            const fn = require(`../commanders/${commmandType}`);
            temArgs[temArgs.length - 1] = cleanArgs(temArgs[temArgs.length - 1]);
            const args = [cwd].concat(temArgs);
            fn.apply(global, args);
        });
    });

    const suggestCommands = (cmd) => {
        didYouMean.threshold = 0.6
        const allCommanders = program.commands.map(cmd => {
            return cmd._name;
        });
        const suggestion = didYouMean(cmd, allCommanders);
        if(suggestion) {
            logger.info(`Did you mean ${suggestion}`)
        }
    };

    // output help information on unknown commands
    program
        .arguments('<command>')
        .action((cmd) => {
            program.outputHelp();
            console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
            console.log();
            suggestCommands(cmd);
        });

    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
        process.exit(1);
    }

        

}

exec();




