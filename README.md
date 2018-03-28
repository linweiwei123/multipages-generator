multipages-generator [![NPM version](https://badge.fury.io/js/multipages-generator.png)](http://badge.fury.io/js/eventproxy)
======

[![NPM](https://nodei.co/npm/multipages-generator.png?downloads=true&stars=true)](https://nodei.co/npm/eventproxy)

> 前端程序员，迟早屌遍天下！ —— [林伟伟](http://medium.yintage.com/)

multipages-generator 🤡是一个像express-generator一样快速生成网站脚手架的npm模块，可以全局安装。只要一个命令即可生成多页面的express工程，是多页面webpack编译的最佳实践模板，最适合多个独立的移动端h5项目，有几个特点：

1. 支持webpack编译多页面，可编译指定项目，也可编译全部项目
2. 前端编译支持热更新
3. 编译出的网页性能经过优化，符合最佳实践
4. 支持development,test,producton环境区分
5. producton环境可配置生产的css,js,images自动编译后上传OSS服务器
6. webpack编译后的html模板支持ejs等模板引擎
7. 使用node.js做服务，nodemon热更新
8. 支持pm2集群启动
9. 🔥 (新) 加入[手淘flexible布局方案](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)，适配不同尺寸和DPI的屏幕，加入postcss支持

## 安装⚙️

通过NPM全局安装即可使用：

```bash
npm install multipages-generator -g
```

## 创建并运行📽

步骤一：执行multipages-generate
```bash
multipages-generate

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
## 运行与开发🤖
### 启动服务端
上面已经启动了，如果还没执行上面的步骤，执行以下命令
```bash
    npm run start
```
### 前端热启动项目facemerge
打开另一个终端黑窗
```bash
    npm run watch:facemerge
```
会有页面打开,没有的话手动打开http://localhost:2000

### 注意：
 本应用需启动两个服务，一个是服务端node.js（端口默认为4000），一个是前端（browser-sync，默认2000）
这里为了让开发时更愉悦，启动了前端服务，具有热更新的性能，每次更新自动编译输出到express工程的对应目录中，项目部署时不需要启动；

## 新增一个项目
apps 目录下已有facemerge，viewport两个项目，新增一个项目xxx，目录结构需参考facemerge
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

## 示例页面
![image](http://ovn18u9yn.bkt.clouddn.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180328152125.jpg?imageView2/1/w/375/h/667)

查看DEMO用手机chrome，淘宝，微信等扫下二维码查看

![image](http://oflt40zxf.bkt.clouddn.com/865e0ff6c664e1b6a194b544ec3321eb.png)

## 未来计划😱
1. 案例demo页完善，做一个腾讯AI的人脸融合H5
2. 加入mysql，mongoDB可选配置
3. 生产环境配置更佳完善
4. 生产编译上传七牛云OSS
5. 文档更详细

## Contribution 主要贡献者列表
🐵
林伟伟
[戴炳泉](https://github.com/DBingo)
[郭舒欣](https://github.com/uouin)
🐵


## License

The MIT License 请自由享受开源。

## 我的其他文章
<http://medium.yintage.com/>

<http://www.yintage.com/>

