/**
 * Created by yitala on 2018/3/6.
 */
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

function getBasicConfig(projectName){
    return {
        entry: [path.join(__dirname,'../',`client/${projectName}/js/index.js`)],
        output: {
            path: path.join(__dirname, '../dist'),
            filename: `${projectName}/js/[name].[hash].js`
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
                    test: /\.(html)$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            attrs: [':data-src','img:src'],
                            interpolate: true,
                            root: '../../../../client'
                        }
                    }
                }
            ]
        },
        // devtool: '#source-map',
        plugins:[
            new ProgressBarPlugin()
        ]
    };
}


module.exports = getBasicConfig;


