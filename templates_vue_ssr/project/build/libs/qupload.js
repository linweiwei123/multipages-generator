const path = require('path');
const qn = require('qn');
const fs = require('fs');
const chalk = require('chalk');
const { qconfig } =  require(path.resolve('mg.config.js')).upload;

var fileTotal = 0;
var fileUploadCount = 0;

var client = qn.create({
    accessKey: qconfig.ACCESS_KEY,
    secretKey: qconfig.SECRET_KEY,
    bucket: qconfig.bucket,
    origin: qconfig.origin,
});

function qnUpload(filePath,filename){
    client.uploadFile(filePath, {key: filename}, function (err, result) {
        if(err){
            console.log(chalk.red(`[Error]: 上传文件失败:${err.toString()}`));
            return;
        }
        console.log(chalk.greenBright(`[Success]: 上传文件至七牛云CDN成功！文件地址:${result.url}`));

        fileUploadCount++;
        // 上传完毕则退出
        if(fileTotal === fileUploadCount){
            console.log(chalk.greenBright('[Success]: 上传完毕 😊!'));
            console.log('Use Ctrl+C to close it\n');
            //process.exit(0);
        }
    });
}

function readDicUpload(filePath,tempPath = ''){
    let filesArr = [];
    try{
        filesArr = fs.readdirSync(filePath)
    }
    catch (e) {
        console.log(chalk.red('[Error]: 要上传的文件路径srcDir不存在'));
        return;
    }
    filesArr.forEach(file => {
        const origFilePath = `${filePath}/${file}`;
        const stats = fs.statSync(origFilePath);
        if(stats.isFile()){
            fileTotal++;
            qnUpload(origFilePath,`${tempPath}/${file}`);
        }
        else if(stats.isDirectory()){
            readDicUpload(origFilePath,`${tempPath}/${file}`);
        }
    })
}

module.exports = readDicUpload;