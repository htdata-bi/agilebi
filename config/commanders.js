module.exports = {
    'init': {
        desc: 'Generate a template for project',
        mode: 'init <app-name>',
        options: [
            {
                name: '--template [templateName]',
                desc: 'custom use a npm template '
            },
            {
                name: '--test-we [test]',
                desc: 'this is a test'
            }
        ]
    },
    'generate': {
        mode: 'generate',
        desc: 'Generate componets json',
      },
    'sync': {
        mode: 'sync',
        desc: 'Updata componnet Info to platform',
        options: [
            {
                name: '--host [hostIp]',
                desc: 'set sync host ip address'
            }
        ]
    },
    'serve': {
        mode: 'serve [entry]',
        desc: 'server a .js file in production mode with zero config'
    },
    'build': {
        mode: 'build [entry]',
        desc: 'build a .js file in production mode with zero config'
    },
    // 'screenshot': {
    //     mode: 'screenshot',
    //     desc: 'Create a screenshot for component'
    // }
}