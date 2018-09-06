const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const CURR_DIR = process.cwd();

const QUESTIONS = [
    {
        name: 'project-name',
        type: 'input',
        message: 'Project name:',
        validate: function (input) {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    }
];

var projectName = '';

function createDirectoryContents (templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8');
            // Rename
            if (file === '.npmignore') file = '.gitignore';
            const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory()) {
            fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

            // recursive call
            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
    });

}

function complete () {
    figlet('Meet CLI', function(err, data) {
        if(err){
            console.log(chalk.red('Some thing about figlet is wrong!'));
        }

        console.log(chalk.yellow(data));
        console.log(chalk.green(`   [Success] Project ${projectName} init finished, be pleasure to use 😊!`));
        console.log();
        console.log('   Install dependencies:');
        console.log(chalk.magenta(`     cd ${projectName} && npm install`));
        console.log();
        console.log('   Run the app:');
        console.log(chalk.magenta('     meet start demo'));
        console.log('   Or:');
        console.log(chalk.magenta('     pm2 start process.json'));

    });

}

module.exports = function(){
    inquirer.prompt(QUESTIONS)
        .then(answers => {
            projectName = answers['project-name'];
            const templatePath = path.join(__dirname,'../../','templates');

            fs.mkdirSync(`${CURR_DIR}/${projectName}`);

            setTimeout(()=>complete(),1000);
            createDirectoryContents(templatePath, projectName);
        });
};