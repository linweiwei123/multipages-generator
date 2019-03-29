import './index.css'
import 'swiper/dist/css/swiper.css'
import Vue from 'vue';
import App from './components/App';
import {isBrowser} from "../../../common/js/commonUtils";

export function createApp(store) {

    let app = new Vue({
        data: store,
        render: h => h(App)
    });

    if (isBrowser()) {
        const eruda = require('eruda');
        eruda.init();
        const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
        Vue.use(VueAwesomeSwiper)
    }

    return { store, app, App}
}