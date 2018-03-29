const path = require('path');
const pages = require('../apps/index');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


function getProjectConfig(projectName) {
    let config = {
        entry:'',
        plugins:[]
    };

    let page = pages[projectName];
    config.entry = path.join(__dirname,'../',page.js);
    config.plugins = getPlugins(projectName);
    return config;
}

function getPlugins(projectName) {
    let ENV = process.env.ENV || 'dev';
    let plugins = [
        new HtmlWebpackPlugin({
            template: path.join(__dirname,`../apps/${projectName}/views/index.html`),
            filename: path.join(__dirname,`../views/${ENV}/${projectName}/index.html`)
        }),
        new ExtractTextPlugin(`css/${projectName}.[contenthash:20].css`)

    ];
    return plugins;
}

module.exports = {
    getProjectConfig
};
