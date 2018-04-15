var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var uuidv4 = require('uuid/v4');
var aliupload = require('../../tools/aliupload');
var qqAiSdk = require('qq-ai-sdk');
var baseImg = require('base64-img');
var streamBuffers = require('stream-buffers');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('demo/index');
});


module.exports = router;

