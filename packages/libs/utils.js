const path = require('path');

function isVueTemplate(){
    console.log('pakcage.json的路径',path.resolve('package.json'));
    let template = require(path.resolve('package.json')).template;
    return template === 'vue_ssr'
}

module.exports = {
    isVueTemplate
}