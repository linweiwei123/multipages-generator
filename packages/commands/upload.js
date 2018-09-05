const chalk = require('chalk');
const shell = require('shelljs');

module.exports = function(){

    shell.exec(`npm run upload`, function(err){
        if(err){
            console.log(chalk.red(err));
            process.exit(0);
        }
    });

};