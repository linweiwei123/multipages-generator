#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const initial = require('../packages/commands/initial');
const start = require('../packages/commands/start');
const build = require('../packages/commands/build');
const upload = require('../packages/commands/upload');
const generate = require('../packages/commands/generate');
const analyse = require('../packages/commands/analysis');
const git = require('../packages/commands/git');

var config = {};

// 配置文件如果存在则读取
if(fs.existsSync(path.resolve('mg.config.js'))){
    config = require(path.resolve('mg.config.js'));
}

// 创建工程
program
    .version('2.0.6','-v, --version')
    .usage('[command]')
    .command('init')
    .description('initialize your project')
    .action(initial);

// 新建模块
program
    .command('new [module]/[module]-[page]')
    .description('generate a new module')
    .action(generate);

// 启动工程
program
    .command('start [module] ')
    .description('start application in development mode')
    .action(start);

// 编译
program
    .command('build [module]')
    .description('build a module using webpack')
    .action(build);

// 上传
program
    .command('upload')
    .description('upload dist files to CDN')
    .action(upload);

// 分析生成文件占比
program
    .command('analyse')
    .description('analysis dist files size and percent')
    .action(function(){
        analyse(path.resolve('dist'));
    });

// 分析生成文件占比
program
    .command('git')
    .description('auto git commit and push')
    .action(git);

program.parse(process.argv);