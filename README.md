multipages-generator [![NPM version](https://badge.fury.io/js/multipages-generator.png)](http://badge.fury.io/js/multipages-generator)
======

[![NPM](https://nodei.co/npm/multipages-generator.png?downloads=true&stars=true)](https://nodei.co/npm/multipages-generator)

multipages-generator （MG） 🤡是一个像express-generator一样快速生成网站开发脚手架的npm模块，可以全局安装。只要一个命令即可生成多页面的express工程，是多页面webpack编译的最佳实践模板，最适合多个独立的移动端h5项目，有几个特点：

## 适合场景
如美柚，淘宝，今日头条，微信内分享的等独立的，小的h5，可以是广告，营销，活动，展示页，秀肌肉，好玩的h5，如[这些](http://www.ih5.cn/not-logged-in/template)。
还有我们的例子：
[美柚吃鸡游戏](https://uedkit.meiyou.com/annualmeeting/game/)

## 优势是 什么？
完整的h5解决方案，快速开发，自动完成性能优化（目前只是基本功能，未完持续，后面支持[google web 性能优化](https://developers.google.com/web/fundamentals/performance/why-performance-matters/)

## 特点

1. 使用Node.js，是一个JavasScript的全栈的H5解决方案，工程可直接部署
2. 高效率开发，支持一键创建模块（业务模块）、一键创建新模块、一键编译发布等快捷命令
3. 工程结构良好划分，结构清晰，可维护。
4. 支持development,producton环境区分
5. 支持sass、less、postcss
6. 开发环境CSS、JS热编译
7. 文件上传支持阿里OSS，七牛云等
8. 🔥 (新) 加入[手淘flexible布局方案](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)，适配不同尺寸和DPI的屏幕
9. 支持pm2集群启动


## Document
* [全局安装](#全局安装)
* [创建一个工程](#创建一个工程)
* [指令介绍](#指令介绍)
* [新建一个模块](#新建一个模块)
* [指定模块启动](#指定模块启动)
* [指定模块编译](#指定模块编译)
* [上传](#上传)
    * [七牛云CDN](#七牛云cdn)
    * [阿里云OSS](#阿里云oss)
* [配置](#配置)
* [TodoList](#TodoList)

## 全局安装 ⚙️

### 环境要求

node环境：node.js 6.11.0

操作系统：支持 mac，windows，centos

### 全局安装

```bash
npm install multipages-generator -g  //目前最新版本为1.5.x
```

## 创建一个工程 📽

```bash
meet init
```

```bash
C:\xxx\workspace>meet init
? Project name: h5-project
  __  __           _      ____ _     ___
 |  \/  | ___  ___| |_   / ___| |   |_ _|
 | |\/| |/ _ \/ _ \ __| | |   | |    | |
 | |  | |  __/  __/ |_  | |___| |___ | |
 |_|  |_|\___|\___|\__|  \____|_____|___|

   [Success] Project h5-project init finished, be pleasure to use 😊!

   Install dependencies:
     cd h5-project && npm install

   Run the app:
     meet start demo
   Or:
     pm2 start process.json

```

注意，由于npm不能存放图片，故demo中使用网络图片替代。开发中用相对路径引用images下的图片

## 指令介绍
查看指令帮助 meet -help
```bash
C:\xxx\workspace>meet -help

  Usage: meet [command]

  Options:

    -v, --version                 output the version number
    -h, --help                    output usage information

  Commands:

    init                          initialize your project
    new [module]/[module]-[page]  generate a new module
    start [module]                start application in development mode
    build [module]                build a module using webpack
    upload                        upload dist files to CDN
    analyse                       analysis dist files size and percent
    git                           auto git commit and push

```
注意，创建模块使用meet new [module]，如果是在该模块下创建其他页面，则使用meet new [module]-[page]。举例：在demo下创建一个详情页面detail.html 使用 meet new demo-detail

## 新建一个模块

meet new [module]/[module]-[page]

```bash
meet new game
```
得到一个文件结构
```bash
game
 ├─images // 由于没有文件，可能不会创建，开发者自行创建images
 ├─js
 | ├─index
 | | ├─business.js  // 具体业务层（可根据业务复杂度再细分）
 | | ├─service.js   // 数据处理层
 | | └─util.js      // 工具类函数层
 | └─index.js       // 主逻辑层
 ├─styles
 | └─index.css      // css
 └─views
   └─index.html     // html源文件
```

## 指定模块启动
### meet start [module]

```
meet start demo
```
启动后会出现如下显示，可点击相应的地址访问
```
 √ Build done

[Tips] visit: http://localhost:8080/demo/
            : http://192.168.50.194:8080/demo/

```

### 热编译

JS、CSS支持热编译，HTML需要刷新

![image](http://oflt40zxf.bkt.clouddn.com/HRM.gif)

生成的html文件中有如下两处标记，用来热编译用。无需担心，编译阶段会删除。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <% include ../head.html %>
  <title>demo</title>
  <!--@hot-reload, will auto remove after compiled-->
  <link rel="stylesheet" data-hr="hot-reload" href="/demo/styles/index.css">
</head>
<body>
  <div>内容...</div>
  <!--@hot-reload, will auto remove after compiled-->
  <script type="text/javascript" data-hr="hot-reload" src="/common/js/hot-reload.js"></script>
</body>
</html>
```

## 指定模块编译

### meet build [demo]

```bash
meet build demo
```

```bash
C:xxx\workspace\h5>meet build demo

> mg-template@1.0.0 build C:\meetyou\workspace\test\mg-workspace\h5
> cross-env NODE_ENV=production node build/commands/build.js "demo"

Delete dist directory!
  ⣾ Building...
  ⣽ lasted 1 seconds. HTML去除开发环境hotReload代码: ..\server\views\prod\demo\index.html
Hash: 2a217fb45f03fb354254
Version: webpack 4.17.2
Time: 1687ms
Built at: 2018-09-06 19:50:40
                               Asset      Size  Chunks             Chunk Names
                  index.12969e6e.css  4.71 KiB       0  [emitted]  index
                   index.080a1e3d.js  1.01 KiB       0  [emitted]  index
..\server\views\prod\demo\index.html  3.74 KiB          [emitted]
Entrypoint index = index.12969e6e.css index.080a1e3d.js

Upload dist files to Qiniu CDN：
Webpack Bundle Analyzer is started at http://127.0.0.1:8888
Use Ctrl+C to close it
[Success]: 上传文件至七牛云CDN成功！文件地址:http://oflt40zxf.bkt.clouddn.com/index.080a1e3d.js
[Success]: 上传文件至七牛云CDN成功！文件地址:http://oflt40zxf.bkt.clouddn.com/index.12969e6e.css
[Success]: 上传完毕 😊!
Use Ctrl+C to close it

```
编译后分析会调用webpack插件显示每个js，css的依赖情况

![image](http://oflt40zxf.bkt.clouddn.com/build.png)

### meet analyse
通过meet analyse 查看占比

![image](http://oflt40zxf.bkt.clouddn.com/chart.png)

## 上传

### meet upload
上传的是dist文件夹中的文件，配置阿里云，七牛云请看mg.config.js
```bash
meet upload
```

## 配置
### mg.config.js
MG目前支持发布时自动,支持阿里OSS、七牛云

mg.config.js 中有如下配置

```
module.exports = {

    // 启动的客户端服务器端口
    clientPort: '8080',

    // 服务端服务器端口
    server: {
        port: '8090',
    },

    // 上传相关配置
    upload: {
        cdn: '//oflt40zxf.bkt.clouddn.com/',
        projectPrefix: 'nodejs-common',

        // 如果是阿里云，则aliconfig配置一个空对象，目前采用.aliossacess 文件配置的方式
        // aliconfig: {
        //
        // },
        // 七牛云

        qconfig: {
            ACCESS_KEY: 'ei1uOdGpVLliA7kb50sLcV9i4wfYLPwt5v0shU10',
            SECRET_KEY: '-pFFIY-ew35Exyfcd67Sbaw40k15ah3UfZTFWFKF',
            bucket:'hotshots-image',
            origin:'http://oflt40zxf.bkt.clouddn.com'
        },

        // 是否编译后自动上传
        autoUpload: true

    }
};

```

## Todo List
1. 性能优化加入手淘的一些方案，以及google的性能优化内容
2. 服务端增加mongodb，mysql，redis等可选配置

## Contribution

[吴俊川](https://github.com/wujunchuan)

感谢俊川提供的热更新方案的建议，以及对项目某些细节的改进

## 配套部署方案请参考
[30分钟快速部署到云服务器上](http://medium.yintage.com/?p=248)


## License

The MIT License 请自由享受开源。
