const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ErudaWebapckPlugin = require('eruda-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader');
const mgConfig = require(path.resolve('mg.config.js'));
const { readClientEntrys } = require('../libs/utils');

// 编译的参数
const argvStr = process.argv.slice(-1)[0];
const isDev = process.env.NODE_ENV === 'development';
const options = getOptions(argvStr);
const moduleBS = options.module;
const pageBS = options.page;
const clientPath = path.resolve('client');
const viewsPath = path.resolve('server/views',isDev ? 'dev' : 'prod');
const modulePath = path.resolve(clientPath, options.module);
const outputPath = path.resolve('dist');
const { entry, htmlPlugins } = readFiles();
const publicPath = isDev? '/' : mgConfig.upload.cdn;

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-eval-source-map' : 'none',
  entry: entry,
  output: {
    path: outputPath,
    publicPath: `${publicPath}`,
    filename: isDev ? '[name].[hash].js' : '[name].[chunkhash:8].js',
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
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: !isDev,
            removeAttributeQuotes: false,
            removeComments: false
          }
        }
      },
      {
        test: /\.(le|c)ss$/,
        use: [
            isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
            isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
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
    ...htmlPlugins,
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[id].[contenthash:8].css'
    }),
    // 针对 moment.js 打包体积过大问题
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor', // 与 output.filename 一致, 即为 'vendor.[chunckhash:8].js'
          chunks: 'all',
          test: /node_modules/,
          enforce: true
        }
      }
    },
  },
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
};

if (isDev) {
  // 开发模式
  module.exports.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new ErudaWebapckPlugin()
  );
} else {
  // 预发/生产模式
  module.exports.optimization = {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor', // 与 output.filename 一致, 即为 'vendor.[chunckhash:8].js'
          chunks: 'initial',
          test: /node_modules/,
          enforce: true
        }
      }
    },
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin(),// 压缩 css 文件
      new UglifyJsPlugin({
        test: /\.js$/,
        exclude: /\/node_modules/,
        // cache: resolve(outputPath, '..', '.cache'),
        parallel: true,// 并行打包
        uglifyOptions: {
          compress: {
            drop_console: true // 去掉所有console.*
          }
        }
      }),
    ]
  };

  module.exports.plugins.push(
    new BundleAnalyzerPlugin({
        analyzerMode: 'static'
    })
  );
}

// 获取人口文件和对应的html
function readFiles() {
  let entrys = {}, htmlPlugins = [];
  let entrysTemp = readClientEntrys(moduleBS, pageBS);
  for(var key in entrysTemp){
    let page = key.split('-')[1];
    let htmlTemplate = resolve(modulePath, page, `app/${page}.html`)
    entrys[page] =  [resolve(modulePath, page, 'entry-client.js'), ...(isDev ? [htmlTemplate,'webpack-hot-middleware/client?reload=true'] : [])]
    htmlPlugins.push(new HtmlWebpackPlugin({
        template: htmlTemplate,
        filename: resolve(`${viewsPath}/${options.module}/${page}.html`),
        chunks: ['vendor', page],
        minify: false
    }))
  }

  return {
    entry: entrys,
    htmlPlugins
  };

}

function getOptions(argvStr){
  let obj = {};
  let nameArr = argvStr.split('-');
  obj.module = nameArr[0];
  obj.page = nameArr.length === 2? nameArr[1] : 'index';
  return obj;
}

function resolve(...dir) {
    return path.resolve(__dirname, ...dir);
}