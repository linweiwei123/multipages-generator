/**
 * Created by yitala on 2018/3/6.
 */

import '../assets/css/app.css';
import '../assets/css/swiper.css';
import Swiper from 'swiper';
import $ from 'jquery';
var { faceMerge } = require('qq-ai-sdk');

var selectModel = 1;

$(document).ready(function () {
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'horizontal',
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    })

    $("#ensure").click(function(){
        selectModel = mySwiper.realIndex;
        $("#page1").hide();
        $("#page2").show();
    })

    $('input[type=file]').change(function () {
        var file = document.querySelector('#img').files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            var base64ImageContent = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            var blob = base64ToBlob(base64ImageContent, 'image/jpg');
            var formData = new FormData();
            formData.append('picture', blob);
            formData.append('model', getModel(selectModel).toString());
            let url = "http://localhost:10017/facemerge/upload";
            $.ajax({
                url: url,
                type: "POST",
                cache: false,
                dataType:'json',
                contentType: false,
                processData: false,
                data: formData})
                .done(function(res){
                    console.log(res,typeof res);
                    $("#merge-content").append(`<img class="merged-img" src="${res.data.url}" />`)
                    console.log('done');
                });

        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    });
});

function getModel(index){
    switch (index){
        case 0:return 1;
        case 1:return 27;
        case 2:return 25;
        default:return 1;
    }
}

function base64ToBlob(base64, mime)
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}
