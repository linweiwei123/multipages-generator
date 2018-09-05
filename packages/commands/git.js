const chalk = require('chalk');
const inquirer = require('inquirer');
const shellHelper = require('../libs/shellHelper');


function gitCommit(){
    // 发布，提示输入commit 信息
    inquirer.prompt([
        {
            name:'message',
            type:'input',
            message:`Enter your publish message \n `
        }
    ])
        .then(answers=>{
            let message = answers.message;
            shellHelper.series([
                'git pull',
                'git add .',
                `git commit -m "${message}"`,
                'git push',
            ], function(err){
                if(err){
                    console.log(chalk.red(err));
                    process.exit(0);
                }
                console.log(chalk.green('Git push finished!'));
                process.exit(0);
            });
        })
        .catch(err=>{
            console.log(chalk.red(err));
        });
}

module.exports = gitCommit;