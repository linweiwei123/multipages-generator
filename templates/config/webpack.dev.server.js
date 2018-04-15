/**
 * Created by yitala on 2018/4/15.
 */
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const projectName = 'viewport';
const getMergeConfig = require('./webpack.option.js');
const config = getMergeConfig(projectName);
const bs = require('browser-sync').create();

const options = {
    contentBase: '../dist',
    hot: true,
    host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
    console.log('dev server listening on port 5000');
});

bs.init({
    port:2000,
    proxy: 'http://localhost:5000',
    files: ['dist/**', 'server/views/dev/**']
});