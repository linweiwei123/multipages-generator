const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');


function getProjectConfig(projectName) {
    let config = {
        entry:[],
        plugins:[]
    };
// 根据projectName 获取entry
//    let page = pages[projectName];
    if(process.env.ENV === 'dev'){
        config.entry.push('webpack-hot-middleware/client?path=http://localhost:4000/__webpack_hmr&timeout=20000&reload=true');
    }
    config.entry.push(path.join(__dirname,'../','client/viewport/js/index.js'));
    config.plugins = getPlugins(projectName);
    return config;
}

function getPlugins(projectName) {
    let ENV = process.env.ENV || 'dev';
    let plugins = [
        new HtmlWebpackPlugin({
            // template: path.join(__dirname,`../client/${projectName}/views/index.html`),
            template: path.join(__dirname,`../server/views/${ENV}/${projectName}/index.html`),
            // filename: path.join(__dirname,`../dist/${projectName}/index.html`)
        }),
        new ExtractTextPlugin(`${projectName}/css/${projectName}.[contenthash:20].css`)

    ];
    if (ENV === 'dev') {
        plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NoEmitOnErrorsPlugin());
    }
    return plugins;
}

module.exports = {
    getProjectConfig
};
