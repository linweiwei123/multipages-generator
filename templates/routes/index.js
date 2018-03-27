var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var uuidv4 = require('uuid/v4');
var aliupload = require('../common/aliupload');
var util = require('../common/util');
var qqAiSdk = require('qq-ai-sdk');
var baseImg = require('base64-img');
var streamBuffers = require('stream-buffers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('facemerge/index');
});

/* GET home page. */
router.get('/viewport', function(req, res, next) {
    res.render('viewport/index');
});

/* GET home page. */
router.get('/voicemerge', function(req, res, next) {
    res.render('voicemerge/index');
});

router.post('/upload',function(req,res){

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req, function(err, fields, files) {
        const rid = uuidv4();
        const stream = fs.createReadStream(files.picture.path);
        const model = fields.model;
        const fileType = files.picture.type;
        const filename = rid + '.' + fileType.substring(fileType.indexOf('/')+1, fileType.length);

        // 1、图片转base64字符串
        let base64imagestr = util.base64_encode(files.picture.path);

        // 2、人脸融合
        qqAiSdk.faceMerge(1,'2',base64imagestr,model)
            .then((res)=>{

                // 3、 输出base64格式的图，转换为buffer
                let buffer = new Buffer(res.data.image, 'base64');

                // 4、上传阿里云oss
                return aliupload({
                    deduplication: true,
                    prefix: 'uedh5.seeyouyima.com/facemerge'
                }, buffer, filename)
                // 4、不上传阿里云oss
                // return {url: "data:image/jpg;base64,"+res.data.image}
            })
            .then(data => {
                // 5、返回url
                res.status(201).send({
                    code: 201,
                    data: {
                        rid,
                        url: data.url
                    },
                    message: '保存成功'
                });
            })
            .catch(errorObj => {
                console.log(errorObj);
                res.status(500).send({
                    code: 500,
                    message: '保存用户作品失败'
                });
            })
    });

});

module.exports = router;

