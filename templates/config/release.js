const webpack = require('webpack');
const chalk = require('chalk');
const util = require('../tools/util.js');
const getDynamicEnvConfig = require('./webpack.config.js');
const qupload = require('../tools/qupload');
const del = require('delete');

const projectName = process.env.PROJECT_NAME;
const webpacker = webpack(getDynamicEnvConfig(projectName));

// 构建前删除构建后的目录
if (typeof projectName === "undefined") {
    throw e("未指定编译的项目");
    return;
} else {
    del.sync([`./server/views/prod/${projectName}/**`]);
}

del.sync([`./dist/${projectName}/**`]);

webpacker.run((err,status)=>{
    if (util.runCallback(err, status)) {

        if(err){
            console.log(chalk.red('[webpack]：编译失败 ' + err.toString()));
            return;
        }

        console.log(chalk.magenta('[webpack]：编译完成！\r\n'));

        // qupload('./public')
    }
});