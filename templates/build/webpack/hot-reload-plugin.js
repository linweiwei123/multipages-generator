class HotReloadPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {

        compiler.plugin("emit", function(compilation,callback) {

            for(var file in compilation.assets){
                if(file.endsWith('.html')){

                    const html = compilation.assets[file].source();
                    const JSReg = /<[^<>]+data-hr="hot-reload[^<>]+>[^<>]*<\/script>/g;
                    const CSSReg = /<[^<>]+data-hr="hot-reload"[^<>]+>/g;

                    var html0 = html.replace(JSReg,'');
                    var html1 = html0.replace(CSSReg,'');

                    console.log('HTML去除开发环境hotReload代码: ' + file);

                    compilation.assets[file] = {
                        source() {
                            return html1;
                        },
                        size() {
                            return html1.length;
                        }
                    };
                }
            }

            callback();

        });
    }
}

module.exports = HotReloadPlugin;