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
const projectName = process.argv[2] || '';
const port = mgConfig.clientPort;

// 提示未创建项目
const projectPath = path.resolve('client', projectName);
if (!fs.existsSync(projectPath)) {
    console.log(chalk.yellow(`[Warn] ${projectPath} is not exist, you can run "npm run new ${projectName}" to create.`));
    process.exit();
}

const webpackConfig = require('../webpack/webpack.config');
const ip = require('../libs/ip');
const app = express();

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

// 编译 + 启动开发服务端
const spinner = new Spinner('Building...\n');
const compiler = webpack(webpackConfig);

compiler.plugin('done', function(){
    setTimeout(() => {
        spinner.stop();
        console.log(chalk.bgGreen('\n √ Build done ') + '\n');
        console.log(chalk.magenta(`[Tips] visit: http://localhost:${port}/${projectName}/`));
        console.log(chalk.magenta(`            : http://${ip()}:${port}/${projectName}/`) + '\n');
    }, 0);
});

const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    // html only
    writeToDisk: filePath => /\.html$/.test(filePath),
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.use(express.static(path.resolve(__dirname, '../../public/assets')));
app.use(proxy(`http://localhost:${mgConfig.server.port}`));
app.listen(8080);
