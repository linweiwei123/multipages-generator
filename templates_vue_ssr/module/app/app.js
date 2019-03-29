import './index.css'
import Vue from 'vue';
import App from './components/App';
import {isBrowser} from "../../../common/js/commonUtils";

export function createApp(store) {

    let app = new Vue({
        data: store,
        render: h => h(App)
    });

    if (isBrowser()) {
       // 特定平台api的逻辑
    }

    return { store, app, App}
}