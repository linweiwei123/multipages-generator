/**
 * Created by yitala on 2018/4/15.
 */
/**
 * Created by yitala on 2018/3/6.
 */
const path = require('path');
const getBasicConfig = require('./webpack.basic');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ENV = process.env.ENV;
const { cdnPath } = require('../mg.config');
const projectName = process.env.PROJECT_NAME;

function getDynamicEnvConfig(projectName){

    let basicConfig = getBasicConfig(projectName);
    if(ENV === 'dev'){
        configDev(basicConfig);
    }
    else if(ENV === 'prod'){
        configProd(basicConfig);
    }
    else {
        throw Error('ENV is not support！');
    }
    return basicConfig;
};

// develop Env Config
function configDev(config){

    let moduleRules = [
        {
            test: /\.(scss|css)$/,
            use: [
                {
                    loader: "style-loader"
                },
                {
                    loader: "css-loader"
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: "sass-loader"
                }
            ]
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: `${projectName}/imgs/[name].[ext]`,
                    }
                }
            ]
        }
    ];

    let plugins = [
        new HtmlWebpackPlugin({
            template: path.join(__dirname,`../server/views/${ENV}/${projectName}/index.html`),
        }),
        new ExtractTextPlugin(`${projectName}/css/${projectName}.[contenthash:20].css`),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ];

    config.entry.unshift('webpack-hot-middleware/client?path=http://localhost:4000/__webpack_hmr&timeout=20000&reload=true');
    config.output.publicPath = '/';
    config.module.rules = config.module.rules.concat(moduleRules);
    config.plugins = config.plugins.concat(plugins);

}

function configProd(config){
    let moduleRules = [
        {
            test: /\.(scss|css)$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            })
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: `${projectName}/imgs/[name].[hash].[ext]`,
                    }
                }
            ]
        }
    ];

    console.log(ENV);

    let plugins = [
        new UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname,`../server/views/dev/${projectName}/index.html`),
            filename: path.join(__dirname,`../server/views/prod/${projectName}/index.html`)
        }),
        new ExtractTextPlugin(`${projectName}/css/${projectName}.[contenthash:20].css`)
    ];

    config.output.publicPath = cdnPath;
    config.module.rules = config.module.rules.concat(moduleRules);
    config.plugins = config.plugins.concat(plugins);

}

module.exports = getDynamicEnvConfig;
