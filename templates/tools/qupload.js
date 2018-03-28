const { qconfig } =  require('../mg.config');
const qn = require('qn');
const fs = require('fs');
const chalk = require('chalk');

var client = qn.create({
    accessKey: qconfig.ACCESS_KEY,
    secretKey: qconfig.SECRET_KEY,
    bucket: qconfig.bucket,
    origin: qconfig.origin,
});

function qnUpload(filePath,filename){
    client.uploadFile(filePath, {key: filename}, function (err, result) {
        if(err){
            console.log(chalk.red(`上传文件失败:${err.toString()}`));
            return;
        }
        console.log(chalk.greenBright(`上传文件至七牛云CDN成功！文件地址:${result.url}`));
    });
}

function readDicUpload(filePath,tempPath = ''){
    let filesArr = [];
    try{
        filesArr = fs.readdirSync(filePath)
    }
    catch (e) {
        console.log(chalk.red('要上传的文件路径srcDir不存在'));
        return;
    }
    filesArr.forEach(file => {
        const origFilePath = `${filePath}/${file}`;
        const stats = fs.statSync(origFilePath);
        if(stats.isFile()){
            qnUpload(origFilePath,`${tempPath}/${file}`);
        }
        else if(stats.isDirectory()){
            readDicUpload(origFilePath,`${tempPath}/${file}`);
        }
    })
}

module.exports = readDicUpload;