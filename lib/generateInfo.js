const path = require('path');

const fse = require('fs-extra');
const chalk = require('chalk');
const glob = require('glob');

const logger = require('../utils/logger.js');
const {getNpmTimeInfo} = require('../utils/npm.js');

const DEFAULT_REGISTRY = 'http://registry.npmjs.com';

const JsonToInfo = (files, cwd, done) => {
    const datas = files.map((file) => {
        const pkg = JSON.parse(fse.readFileSync(path.join(cwd, file)));

        // 每个组件packge.json标识性属性 componetConfig
        const materialConfig= pkg['componentConfig'] || {}
        const registry = (pkg.publishConfig && pkg.publishConfig.registry) || DEFAULT_REGISTRY;
        const result = {
            // (必)英文名
            npmName: materialConfig.name,
            // (必)中文描述
            title: materialConfig.title,
            description: pkg.description,
            homepage: pkg.homepage,
            categories: materialConfig.categories || [],
            repository: pkg.repository && pkg.repository.url,
            source: {
                type: 'npm',
                packageName: pkg.name,
                version: pkg.version,
                registry
            },
            // (必) 用于说明组件依赖关系
            dependencies: pkg.dependencies || {},
            // (必) 截图
            screenshot: materialConfig.screenshot,
            // 支持用户自定义的配置
            customConfig: materialConfig.customConfig || null,
        };
        return result;
    });

    // 通过npm检验包信息,同时补全信息
    Promise.all(datas.map((data)=> {
        const packageName = data.source.packageName;
        const version = data.source.version;
        return getNpmTimeInfo(packageName, version)
            .then(time => {
                data.publishTime = time.created;
                data.updataTime = time.modified;
                return data;
            });
    })).then(data => {
        done(data);
    });
};  

const gatherInfo = (pattern, cwd) => {
    // TODO 这里的包状态延迟时间还需要一个好的方案
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            glob(
                pattern,
                {cwd, nodir: true},
                (err, files) => {
                    if (err) {
                        logger.fatal(err);
                        reject(err);
                    } else {
                        JsonToInfo(files, cwd, resolve);
                    }
                }
            );
        }, 10000);
        // glob(
        //     pattern,
        //     {cwd, nodir: true},
        //     (err, files) => {
        //         if (err) {
        //             logger.fatal(err);
        //             reject(err);
        //         } else {
        //             JsonToInfo(files, cwd, resolve);
        //         }
        //     }
        // );
        
    });
};


module.exports = (name, cwd, conifg) => {
    const distDir = path.resolve(process.cwd(), 'build');

    fse.ensureDirSync(distDir);
    return gatherInfo('./package.json', cwd)
        .then(componentsInfo => {
            logger.info('数据生成完毕，准备生成文件');

            const data = {
                ...conifg,
                name,
                components: componentsInfo
            };
            const filePath = path.resolve(distDir, 'info.json');
            fse.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
            console.log();
            console.log(`Created ${name} json at: ${chalk.yellow(filePath)}`);
            console.log();
        });
}