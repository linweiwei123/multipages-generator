const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// 获取命令携带的参数
const modulePage = process.argv[3] || '';
const CSS = `@import url('../../common/css/base.css');
`;

var HTML = '';
var JS = '';

function generate_native(){
    if(modulePage === ''){
        console.log(chalk.yellow('[warning]: You have not specify a module to start, you can run "meet start [module]"'));
        return;
    }

    let nameArr = modulePage.split('-');
    let page = nameArr.length == 2?nameArr[1]:'index';
    let moduleDir = nameArr[0];
    let targetPath = path.resolve(`client/${moduleDir}`);
    let options = {
        module: moduleDir,
        page,
        targetPath
    };

    HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <link type="image/x-icon" href="//static.seeyouyima.com/data.tataquan.com/a4a3168b/favicon.ico" rel="shortcut icon">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
    <script type="text/javascript">!function(){var e;750<(e=document.documentElement.clientWidth||window.screen.width)&&(e=750),document.documentElement.style.fontSize=e/375*10+"px"}()</script>
    <title>模板页面</title>
</head>
<body>
    <!--vue-ssr-outlet-->
</body>
</html>`;

    JS = `import '../styles/${page}.css'`;

    let filePath = path.join(targetPath, page,`entry-client.js`);
    if(fs.existsSync(filePath)){
        console.log(chalk.red('该页面已存在，如果需要覆盖，请先删除'));
        return;
    }

    copyModule(options);

    // 生成网页JavaScript、stylesheets目录，模板
    generateAssets(options);
    //
    // 生成router文件，配置router
    generateRouter(options);
    //
    // router/index.js 增加配置
    generateRouteIndex(options);
    //
    // 添加webpack entrys
    generateClientEntry(options);

    // 添加 webpack server entrys
    generateServerEntry(options);

}

function generateAssets(options){

    HTML = HTML.replace('模板页面',`模板页面${options.page}`);

    if(!fs.existsSync(options.targetPath)){
        fs.mkdirSync(options.targetPath);
    }

    let viewPath = path.resolve('client',options.module, options.page, 'app', `${options.page}.html`);

    fs.writeFileSync(viewPath, HTML, 'utf8');
    console.log(chalk.green(`覆盖了文件：`+ viewPath));
}

function generateRouter(options){
    const routerPath = path.resolve('server/routes', `${options.module}-${options.page}` +'.js');
    const ROUTER = `
const fs = require('fs');
const path = require('path');
const { createBundleRenderer } = require('vue-server-renderer');
const env = process.env.ENV !== 'prod' ? 'dev' : 'prod';
const bundle = fs.readFileSync(path.resolve('server/ssr_code/${options.module}/${options.page}-server.js'), 'utf8');
const renderer = createBundleRenderer(bundle, {
    template: fs.readFileSync(path.resolve('server/views/' + env + '/${options.module}/${options.page}.html'), 'utf8')
});

module.exports.index = function(req, res){

    if(req.query.ssr === 'true'){
        const context = { url: req.url }
        console.log('render start', new Date().getTime())
        renderer.renderToString(context, (err, html) => {
            if(err){
                console.log(err);
            }
            console.log('render End', new Date().getTime())
            res.end(html)
        })
    }
    else{
        res.render('${options.module}/${options.page}')
    }

};
`;
    if(!fs.existsSync(routerPath)){
        fs.writeFileSync(routerPath,ROUTER,'utf8');
        console.log(chalk.green(`创建了router文件：`+ routerPath));
    }

}

function generateRouteIndex(options) {
    let routeIndex = path.resolve('server/routes/index.js');
    let content = fs.readFileSync(routeIndex,'utf8');
    let content1= content;
    let fileName = `${options.module}_${options.page}`;
    let depName = `${options.module}-${options.page}`;
    if(content.indexOf(`const ${fileName} = require('./${depName}');
//<@add page@>`) === -1){
        content1 = content.replace(`//<@add page@>`,`const ${fileName} = require('./${depName}');
//<@add page@>`);
    }

    let content2 = content1.replace('//<@add page router@>', `app.get('/${options.module}${options.page==='index'? '': '/' + options.page}', ${fileName}.index);
    //<@add page router@>`);
    fs.writeFileSync(routeIndex,content2,'utf8');
    console.log(chalk.green(`server/router/index.js增加了router配置：`));
}

function generateClientEntry(options){
    const entryPath = path.resolve('build/modules-client.js');
    let content = fs.readFileSync(entryPath,'utf8');
    let addedPage =  `'client/${options.module}/${options.page}/entry-client.js'`;
    let final = content.replace(`
}`,`
  ,'${options.module + '-' + options.page}': ${addedPage}
}`);

    fs.writeFileSync(entryPath,final,'utf8');
    console.log(chalk.green(`build/modules-client.js增加了：`+ addedPage));
}


function generateServerEntry(options){
    const entryPath = path.resolve('build/modules-server.js');
    let content = fs.readFileSync(entryPath,'utf8');
    let addedPage =  `'client/${options.module}/${options.page}/entry-server.js'`;
    let final = content.replace(`
}`,`
  ,'${options.module + '-' + options.page}': ${addedPage}
}`);

    fs.writeFileSync(entryPath,final,'utf8');
    console.log(chalk.green(`build/modules-server.js增加了：`+ addedPage));
}

function copyModule(options){
    // module文件夹检测是否存在，不存在则创建
    if(!fs.existsSync(options.targetPath)){
        fs.mkdirSync(options.targetPath);
    }
    // page文件夹检测是否存在，不存在则创建
    let targetPath = path.resolve(options.targetPath, options.page);
    if(!fs.existsSync(targetPath)){
        fs.mkdirSync(targetPath);
    }
    const templatePath = path.join(__dirname,'../../../', 'templates_vue_ssr/module');
    createDirectoryContents(templatePath, targetPath);
}

function createDirectoryContents (templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8');
            const writePath = `${newProjectPath}/${file}`;

            console.log(chalk.green(`创建了文件：`+ writePath));
            fs.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory()) {
            fs.mkdirSync(`${newProjectPath}/${file}`);

            // recursive call
            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
    });

}


module.exports = generate_native;