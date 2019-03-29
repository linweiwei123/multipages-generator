const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const del = require('delete');
const doUpload = require('../libs/doupload');
const Spinner = require('../libs/spinner');
const argvStr = process.argv.slice(-1)[0];
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
const webpackConfig = require(path.resolve('build/webpack/webpack.config.js'));
const spinner = new Spinner('Building...\n');

webpack(webpackConfig, (err, stats) => {
    spinner.stop();

    if (err) throw err;

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');

    // 如果配置了自动上传则立即上传
    if(mgConfig.upload.autoUpload === true){
        doUpload();
    }

});