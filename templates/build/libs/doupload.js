const path = require('path');
const chalk = require('chalk');
const qupload = require('./qupload');
const aliupload = require('meetyou-ali-oss');
const mgConfig = require('../../mg.config.js');

function doUpload(){

    var aliconfig = mgConfig.upload.aliconfig;
    var qconfig = mgConfig.upload.qconfig;
    var distPath = path.resolve('dist');

    if(typeof aliconfig === 'object'){
        aliupload({
            "srcDir": path.resolve('dist'),
            "ignoreDir": false,
            "deduplication": true,
            "prefix": mgConfig.upload.projectPrefix
        });
        return;
    }

    if(typeof qconfig === 'object'){
        console.log(chalk.greenBright('\n' + 'Upload dist files to Qiniu CDN：' ));
        qupload(distPath);
        return;
    }
}

module.exports = doUpload;