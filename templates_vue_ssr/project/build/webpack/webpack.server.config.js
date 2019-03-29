const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const del = require('delete');
const mgConfig = require(resolve('mg.config.js'));
const { readServerEntrys } = require('../libs/utils');

// 编译的参数
const argvStr = process.argv.slice(-1)[0];
const options = getOptions(argvStr);
const isDev = process.env.NODE_ENV === 'development';
const publicPath = isDev? '/' : mgConfig.upload.cdn;
const clientPath = resolve('client');
const modulePath = resolve(clientPath, options.module);
const moduleBS = options.module;
const pageBS = options.page;

del.sync([`./server/ssr_code/${moduleBS}/**`]);

module.exports = (opts = {}) => {
    var config = {
        mode: isDev ? 'development' : 'production',
        entry: readServerEntrys(moduleBS, pageBS),
        target: 'node',
        output: {
            path: resolve(`server/ssr_code/${moduleBS}`),
            publicPath: publicPath,
            filename: '[name].js',
            libraryTarget: 'commonjs2'
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: 'vue-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(le|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'less-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: '[hash:8].[ext]'
                        }
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[hash:8].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[hash:8].[ext]'
                    }
                }
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: '../../../dist/[name].[contenthash:8].css',
                chunkFilename: '[id].[contenthash:8].css'
            }),
            // new BundleAnalyzerPlugin({
            //     analyzerMode: 'static'
            // })
        ],
        resolve: {
            extensions: ['.js', '.vue', '.less', 'scss', '.json'],
            alias: {
                '@': modulePath,
            }
        },
        performance: {
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js');
            },
            hints: isDev ? false : 'warning' // 当打包的文件大于 244 KiB 是会在提出警告
        }
    }

    return config;
};

function getOptions(argvStr){
    let obj = {};
    let nameArr = argvStr.split('-');
    obj.module = nameArr[0];
    obj.page = nameArr.length === 2? nameArr[1] : 'index';
    return obj;
}