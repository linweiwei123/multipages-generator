const webpack = require('webpack');
const chalk = require('chalk');
const util = require('./util.js');
const getMergeConfig = require('./webpack.option.js');
const qupload = require('./qupload');
const del = require('delete');

const projectName = process.env.PROJECT_NAME;
const webpacker = webpack(getMergeConfig(projectName));

// 构建前删除构建后的目录
if (typeof projectName === "undefined") {
    throw e("未指定编译的项目");
    return;
} else {
    del.sync([`./views/prod/${projectName}/**`]);
}

del.sync([`./public/**`]);
del.sync([`./public/**`]);
del.sync([`./public/**`]);

webpacker.run((err,status)=>{
    if (util.runCallback(err, status)) {

        if(err){
            console.log(chalk.red('[webpack]：编译失败 ' + err.toString()));
            return;
        }

        console.log(chalk.magenta('[webpack]：编译完成！\r\n'));

        qupload('./public')
    }
})