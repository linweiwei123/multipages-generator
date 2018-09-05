const shell = require('shelljs');
const chalk = require('chalk');

module.exports = function start(){

    // 获取命令携带的参数
    const argvStr = process.argv[3] || '';

    if(argvStr === ''){
        console.log(chalk.yellow('[warning]: You have not specify a module to start, you can run "meet start [module]"'));
        return;
    }

    shell.exec(`npm run start ${argvStr}`, function(err){
        if(err){
            console.log(chalk.red(err));
            process.exit(0);
        }
    });

}