const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const del = require('delete');
const fs = require('fs');
const doUpload = require('../libs/doupload');
const Spinner = require('../libs/spinner');
const argvStr = process.argv.slice(-1)[0];
const options = getOptions(argvStr);
const moduleSp = options.module;
const mgConfig = require('../../mg.config.js');

// 如果未指定编译模块，则提示返回
if(argvStr === ''){
    console.log(chalk.yellow('[warning]: You have not specify a module to build, you can run "meet build [module]"'));
    return;
}

// 删除dist下的所有文件
console.log(chalk.blue('Delete dist directory!'));
del.sync([`./dist/**`]);

// 获取命令携带的参数
const webpackClient = require(path.resolve('build/webpack/webpack.client.config.js'));
const webpackServer = require(path.resolve('build/webpack/webpack.server.config.js'));
const spinner = new Spinner('Building...\n');

const clientPack = function(){
    return new Promise((resolve, reject) => {
        webpack(webpackClient, (err, stats) => {
            spinner.stop();

            if (err) throw err;

            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n');

            resolve(true);
        });
    })
}

const serverPack = function(){
    return new Promise((resolve, reject) => {
        webpack(webpackServer(), (err, stats) => {
            spinner.stop();

            if (err) throw err;

            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n');

            resolve(true);
        });
    })
}

serverPack()
    .then( () => clientPack())
    .then( () => {
        replaceCssContent();
        if(mgConfig.upload.autoUpload === true){
           doUpload();
        }
    })
    .catch(err => {
        console.log('build 出错', err);
    });

/**
 * client 与 server 构建的CSS module id 不同导致同构的css代码不同，目前使用server构建的css来临时解决；即：
 * 用server构建的的css覆盖client构建的css
 */
function replaceCssContent(){
    let files = fs.readdirSync(path.resolve('dist'));
    let serverPackedCSS = [];
    // 遍历找出所有server pack的css文件
    files.forEach( file => {
        if(file.endsWith('.css') && file.indexOf('-server.') !== -1){
            serverPackedCSS.push(file);
        }
    })

    // 根据文件命名规则 page-server.xxxxxx.css,找出相应的css文件名，做覆盖
    serverPackedCSS.forEach( serverCssFile => {
        let page = serverCssFile.split('-server')[0];
        files.forEach( item => {
            if(item.endsWith('.css') && item.indexOf( page + '.') !== -1){
                fs.writeFileSync(path.resolve('dist', item), fs.readFileSync(path.resolve('dist', serverCssFile), 'utf8'))
            }
        })
    })
}

function getOptions(argvStr){
    let obj = {};
    let nameArr = argvStr.split('-');
    obj.module = nameArr[0];
    obj.page = nameArr.length === 2? nameArr[1] : 'index';
    return obj;
}