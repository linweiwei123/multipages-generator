const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// 获取命令携带的参数
const modulePage = process.argv[3] || '';

const CSS = `@import url('../../common/css/base.css');

html, body{
    height: 100%;
    width: 100%;
}

.container{
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 64px;
    color: #4fc08d;
    font-weight: bold;
}

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
<html lang="zh-CN">
<head>
  <% include ../head.html %>
  <title>${moduleDir}</title>
  <!--@hot-reload, will auto remove after compiled-->
  <link rel="stylesheet" data-hr="hot-reload" href="/${options.module}/styles/index.css">
</head>
<body>

  <div class="container"><%= data %></div>
  
  <!--@hot-reload, will auto remove after compiled-->
  <script type="text/javascript" data-hr="hot-reload" src="/common/js/hot-reload.js"></script>
</body>
</html>`;

    JS = `import '../styles/${page}.css'`;

    let filePath = path.join(targetPath,'js',`${page}.js`);
    if(fs.existsSync(filePath)){
        console.log(chalk.red('该页面已存在，如果需要覆盖，请先删除'));
        return;
    }

    // 生成网页JavaScript、stylesheets目录，模板
    generateAssets(options);

    // 生成router文件，配置router
    generateRouter(options);

    // router/index.js 增加配置
    generateRouteIndex(options);

    // 添加webpack entrys
    generateEntry(options);

}

function generateAssets(options){
    let ImgPath = path.resolve(options.targetPath,'images');
    let JSPath = path.resolve(options.targetPath,'js');
    let CSSPath = path.resolve(options.targetPath,'styles');
    let viewPath = path.resolve('client',options.module,'views');

    HTML = HTML.replace('模板页面',`模板页面${options.page}`);

    let pathArr = [
        {
            path: ImgPath,
            type: 'img',
            content: null
        },
        {
            path: JSPath,
            type: 'js',
            content: JS
        },
        {
            path: CSSPath,
            type: 'css',
            content: CSS
        },
        {
            path: viewPath,
            type: 'html',
            content: HTML
        }
    ];

    if(!fs.existsSync(options.targetPath)){
        fs.mkdirSync(options.targetPath);
    }

    // generate_native dir and file
    pathArr.some((item)=>{
        if(!fs.existsSync(item.path)){
            fs.mkdirSync(item.path);
        }
        if(item.content !== null){
            let filePath = path.join(item.path,`${options.page}.${item.type}`);
            fs.writeFileSync(filePath,item.content,'utf8');
            console.log(chalk.green(`创建了文件：`+ filePath));
        }
    });

    // 生成js 相关文件
    let partialDir = path.resolve('client',options.module,'js',options.page);
    if(!fs.existsSync(partialDir)){
        fs.mkdirSync(partialDir);
    }
    ['business','service','utils'].forEach((item)=>{
        let jsPartial = path.join(partialDir,item + ".js");
        fs.writeFileSync(jsPartial,'','utf8')
    })
}

function generateRouter(options){
    const routerPath = path.resolve('server/routes',options.module+'.js');
    const ROUTER = `
module.exports.index = function(req, res){
  res.render('${options.module}/index',{ data: 'index'})
};
`;
    if(!fs.existsSync(routerPath)){
        fs.writeFileSync(routerPath,ROUTER,'utf8');
        console.log(chalk.green(`创建了router文件：`+ routerPath));
    }
    else {
        let content = fs.readFileSync(routerPath,'utf8');
        content +=`
module.exports.${options.page} = function(req, res){
  res.render('${options.module}/${options.page}', { data: '${options.page}'})
};      
    `;
        fs.writeFileSync(routerPath,content,'utf8');
        console.log(chalk.green(`创建了router文件：`+ routerPath));
    }

}

function generateRouteIndex(options) {
    let routeIndex = path.resolve('server/routes/index.js');
    let content = fs.readFileSync(routeIndex,'utf8');
    let content1= content;
    if(content.indexOf(`const ${options.module} = require('./${options.module}');
//<@add page@>`)==-1){
        content1 = content.replace(`//<@add page@>`,`const ${options.module} = require('./${options.module}');
//<@add page@>`);
    }

    let content2 = content1.replace('//<@add page router@>', `app.get('/${options.module}${options.page==='index'? '': '/' + options.page}', ${options.module}.${options.page});
    //<@add page router@>`);
    fs.writeFileSync(routeIndex,content2,'utf8');
    console.log(chalk.green(`server/router/index.js增加了router配置：`));
}

function generateEntry(options){
    const entryPath = path.resolve('build/modules.js');
    let content = fs.readFileSync(entryPath,'utf8');
    let addedPage =  `'${options.module}/js/${options.page}.js'`;
    let final = content.replace(`
}`,`
  ,'${options.module + '-' + options.page}': ${addedPage}
}`);

    fs.writeFileSync(entryPath,final,'utf8');
    console.log(chalk.green(`build/modules.js增加了：`+ addedPage));

}


module.exports = generate_native;