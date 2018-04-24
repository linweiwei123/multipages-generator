var express = require('express');
var router = express.Router();
var aliupload = require('../../tools/aliupload');


/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('demo/index');
});


module.exports = router;

