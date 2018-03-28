import '../../common/css/swiper.css';
import '../assets/css/index.scss';
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