var getMergeConfig = require('./webpack.option.js');
const webpack = require('webpack');
const bs = require('browser-sync').create();
const chalk = require('chalk');
const util = require('./util.js');
const projectName = process.env.PROJECT_NAME;
const webpacker = webpack(getMergeConfig(projectName));

webpacker.watch({
    ignored: /node_modules/,
    aggregateTimeout: 500,
},(err,status)=>{
    if (util.runCallback(err, status)) {
        console.log(chalk.green('[webpack]: build done!\r\n'));
    }
});

webpacker.run((err,status)=>{
    if (util.runCallback(err, status)) {
        // start browser-sync
        bs.init({
            port:2000,
            proxy: 'http://localhost:4000',
            files: ['public/assets/**', 'views/**', 'views_dev/**']
        });
    }
})