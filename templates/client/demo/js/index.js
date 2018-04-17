/**
 * Created by yitala on 2018/4/14.
 */
import '../css/index.css';
import '../../common/css/swiper.css';
import $ from 'jquery';
import Swiper from 'swiper';

$(document).ready(function(){
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'horizontal',
        loop: true,

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        }
    })
});

if (module.hot) {
    console.log('module.hot');
    module.hot.accept();
}

document.querySelector('body').style.backgroundColor = 'yellow';