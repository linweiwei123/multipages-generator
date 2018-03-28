/**
 * Created by yitala on 2018/3/6.
 */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { getProjectConfig } = require('./webpack.dypage');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { cdnPath } = require('../mg.config');

const ENV = process.env.NODE_ENV;

let publicPath = '/';
if(ENV === 'production'){
    publicPath = cdnPath;
}


function getMergeConfig(projectName){
    let dynamicConfig = getProjectConfig(projectName);
    return {
        entry: dynamicConfig.entry,
        output: {
            publicPath: publicPath,
            path: path.join(__dirname, '../public'),
            filename: 'js/[name].[hash].js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                { test: /\.txt$/, use: 'raw-loader' },
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
                    test: /\.(html)$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            attrs: [':data-src','img:src'],
                            interpolate: true
                        }
                    }
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/[name].[hash].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins:getPlugins(dynamicConfig.plugins),
        devServer: {
            historyApiFallback: true,
            hot: true,
            compress: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 300
            }
        }
    };
}


function getPlugins(toConcatPlugins) {
    let plugins = [new ProgressBarPlugin()];
    if(process.env.ENV !== 'dev'){
        plugins.push(new UglifyJsPlugin())
    }
    plugins = plugins.concat(toConcatPlugins);
    return plugins;
}


module.exports = getMergeConfig;


