const fs = require('fs');
const path = require('path');
const { createBundleRenderer } = require('vue-server-renderer');
const env = process.env.ENV !== 'prod' ? 'dev' : 'prod';
const bundle = fs.readFileSync(path.resolve('server/ssr_code/demo/index-server.js'), 'utf8');
const renderer = createBundleRenderer(bundle, {
    template: fs.readFileSync(path.resolve('server/views/' + env + '/demo/index.html'), 'utf8')
});

module.exports.index = function(req, res){

    if(req.query.csr === 'true'){
      res.render('demo/index')
    }
    else{
      const context = { url: req.url }
      // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
      // 现在我们的服务器与应用程序已经解耦！
      console.log('render start', new Date().getTime())
      renderer.renderToString(context, (err, html) => {
        if(err){
          console.log(err);
        }
        console.log('render End', new Date().getTime())
        res.end(html)
      })
    }

};
