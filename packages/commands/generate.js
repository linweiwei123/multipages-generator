const utils = require('../libs/utils');
const gr_native = require('./generate/generate_native');
const gr_vue_ssr = require('./generate/generate_vue_ssr');

function generate(){
    if(utils.isVueTemplate()){
        gr_vue_ssr();
    }
    else {
        gr_native();
    }
}

module.exports = generate;