#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');
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

inquirer.prompt(QUESTIONS)
    .then(answers => {
        const projectName = answers['project-name'];
        const templatePath = `${__dirname}/templates`;

        fs.mkdirSync(`${CURR_DIR}/${projectName}`);

        setTimeout(()=>complete(),1000);
        createDirectoryContents(templatePath, projectName);
    });


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
    console.log();
    console.log('   install dependencies:');
    console.log('     %s cd %s && npm install');
    console.log();
    console.log('   run the app:');
    console.log('     npm run start');
    console.log('   or:');
    console.log('     pm2 start process.json');
}