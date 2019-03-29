const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxy = require('http-proxy-middleware');
const chalk = require('chalk');
const Spinner = require('../libs/spinner');
const mgConfig = require(path.resolve('mg.config.js'));

const app = express();
const projectName = process.argv[2] || '';
const port = mgConfig.clientPort;
// 提示未创建项目
const projectPath = path.resolve('client', projectName);
if(projectName === ''){
    console.log(chalk.yellow(`[Warn] module is not exist, you can run "npm run start [module]"`));
    process.exit();
}
if (!fs.existsSync(projectPath)) {
    console.log(chalk.yellow(`[Warn] ${projectPath} is not exist, you can run "npm run new ${projectName}" to create.`));
    process.exit();
}

const webpackClient = require('../webpack/webpack.client.config');
const webpackSever = require('../webpack/webpack.server.config');
const ip = require('../libs/ip');

// 编译 + 启动开发服务端
const spinner = new Spinner('Building...\n');

// 步骤一、热编译client端项目
const compiler = webpack(webpackClient);

compiler.plugin('done', function(){
    setTimeout(() => {
        spinner.stop();
        console.log(chalk.bgGreen('\n √ Build done ') + '\n');
        console.log(chalk.magenta(`[Tips] visit: http://localhost:${port}/${projectName}/`));
        console.log(chalk.magenta(`            : http://${ip()}:${port}/${projectName}/`) + '\n');
    }, 0);
});

const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackClient.output.publicPath,
    // html only
    writeToDisk: filePath => /\.html$/.test(filePath),
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.use(express.static(path.resolve(__dirname, '../../public/assets')));
app.use(proxy(`http://localhost:${mgConfig.server.port}`));
app.listen(8080);

// 步骤二、服务端监听构建Vue
const serverCompiler = webpack(webpackSever());

const watching = serverCompiler.watch({
    // watchOptions 示例
    aggregateTimeout: 300,
    poll: undefined
}, (err, stats) => {
    // 在这里打印 watch/build 结果...
    console.log(chalk.bgGreen('\n √ Server compile done ') + '\n');

    if (err) {
        console.error(err);
        return;
    }

    if(stats.hasErrors()){
        console.log(chalk.red('\n ✖️ Server compile Error ') + '\n');

        console.log(stats.toString({
            chunks: false,  // 使构建过程更静默无输出
            colors: true    // 在控制台展示颜色
        }));
    }

});

// 步骤三、4秒后启动服务
setTimeout(function () {
    // 启动代理服务端
    const processServer = exec(`npm run server`);

    processServer.stdout.on('data', stats => {
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n');
    });
}, 6000)