const chalk = require('chalk');
const shell = require('shelljs');
const path = require('path');
const analyse = require('./analysis');

module.exports = function(){

    const argvStr = process.argv[3] || '';

    // 如果未指定编译模块，则提示返回
    if(argvStr === ''){
        console.log(chalk.yellow('[warning]: You have not specify a module to build, you can run "meet build [module]"'));
        return;
    }

    shell.exec(`npm run build ${argvStr}`, function(err){
        if(err){
            console.log(chalk.red(err));
            process.exit(0);
        }
    });

};