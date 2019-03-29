import {createStore} from "./app/store";
import { deepExtend } from "../../common/js/commonUtils";
import {createApp} from "./app/app";

let store = createStore();
store.state = deepExtend(store.state, window.__INITIAL_STATE__);
let { app, App } = createApp(store);

// 降级方案，判断是否要做CSR
if(isCSR()){
    createAppEl();
    App.asyncData(store)
        .then( resp => {
            app.$mount('#app', true);
        })
}
else {
    app.$mount('#app', true);
}

// 检查有没有appid，没有则表示是CSR，创建一个div，设置id为app
function isCSR(){
    let appEl = document.getElementById('app');
    return !appEl;
}

function createAppEl(){
    let appEl = document.createElement('div');
    appEl.setAttribute('id', 'app')
    document.querySelector('body').insertBefore(appEl, document.querySelector('body').firstChild);
}