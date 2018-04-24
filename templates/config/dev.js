/**
 * Created by yitala on 2018/4/14.
 */
const webpack = require('webpack');
const bs = require('browser-sync').create();
const projectName = process.env.PROJECT_NAME;
const getDynamicEnvConfig = require('./webpack.config.js');
const config = getDynamicEnvConfig(projectName);
const webpacker = webpack(config);


module.exports = function(app){

    app.use(require("webpack-dev-middleware")(webpacker, {
        noInfo: false,
        publicPath: config.output.publicPath,
        reload: true
    }));

    app.use(require("webpack-hot-middleware")(webpacker, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));

    bs.init({
        open: false,
        port: 2000,
        proxy: 'http://localhost:4000',
        files: ['dist/**', 'views/dev/**']
    });

};