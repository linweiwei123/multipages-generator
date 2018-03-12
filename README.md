multipages-generator [![NPM version](https://badge.fury.io/js/multipages-generator.png)](http://badge.fury.io/js/eventproxy)
======

[![NPM](https://nodei.co/npm/multipages-generator.png?downloads=true&stars=true)](https://nodei.co/npm/eventproxy)

> 前端程序员，迟早屌遍天下！ —— [林伟伟](http://medium.yintage.com/)

multipages-generator 仅仅一个命令即可生成多页面的express网站模板的npm module，为多页面（无上限）webpack编译的最佳实践网站，最适合多个独立的移动端h5项目，有几个特点：

1. 支持webpack编译多页面，可编译指定项目，也可编译全部项目
2. 前端编译支持热更新
3. 编译出的网页性能经过优化，符合最佳实践
4. 支持development,test,producton环境区分
5. producton环境可配置生产的css,js,images自动编译后上传OSS服务器
6. webpack编译后的html模板支持ejs等模板引擎
7. 使用node.js做服务，nodemon热更新
7. 支持pm2集群启动

## 安装

通过NPM全局安装即可使用：

```bash
npm install multipages-generator -g
```

### 创建并运行

步骤一：执行multipages-generator
```bash
multipages-generator

```
步骤二：出现输入项目名提示，并输入您的项目名称
```bash
? Project name: <输入项目名>

```
步骤三：进入目录 -> install -> 启动
```bash
   install dependencies:
     %s cd %s && npm install

   run the app:
     npm run start
   or:
     pm2 start process.json
```
### 开发模式启动项目facemerge
打开另一个终端黑窗
```bash
    npm run watch:facemerge
```
会有页面打开,没有的话手动打开http://localhost:3000

### 注意：
 本应用需启动两个服务，一个是服务端node.js（端口默认为4000），一个是前端（browser-sync，默认3000）

## 新增一个项目
apps 目录下已有facemerge，voicemerge两个项目，新增一个项目xxx，目录结构需参考facemerge
```bash
├─facemerge
│  ├─assets
│  │  ├─css
│  │  └─imgs
│  ├─js
│  └─views
└─voicemerge
```
```bash
    "watch:facemerge": "rimraf public &&cross-env ENV=dev PROJECT_NAME=facemerge node ./tools/webpack.watch.js"
```
启动方式跟上述 “开发模式启动项目facemerge” 相同

## License

The MIT License 请自由享受开源。

## 我的其他文章
<http://medium.yintage.com/>

<http://www.yintage.com/>

