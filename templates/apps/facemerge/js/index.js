/**
 * Created by yitala on 2018/3/6.
 */

import '../assets/css/app.css';
import '../assets/css/swiper.css';
import Swiper from 'swiper';
import $ from 'jquery';
const tool = require('./tools.js');
const minish = require('./minish.js');
var { faceMerge } = require('qq-ai-sdk');
var selectModel = 1;

function showToast(text, desc) {
    tool.showToast(text, desc);
  }
function getModel(index){
    const modelArr = {
        0:6891,
        1:9,
        2:6,
    }
    return modelArr[index];
}
$(document).ready(function () {
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        centeredSlides: true,
        paginationClickable: true,
        preventLinksPropagation: true,
        lazyLoading: true,
        lazyLoadingInPrevNext: true,
        lazyLoadingInPrevNextAmount: 2,
        spaceBetween: 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
        slideChangeTransitionEnd: () => {
            if ($('#ensure').hasClass('tada')) {
              return;
            }
            $('#ensure').addClass('tada');
            setTimeout(() => {
              $('#ensure').removeClass('tada');
            }, 500);
          }
        },
    })

    $(".mzc-toast").click(function(e){
        $(this).removeClass('show')
    });
    $("#ensure").click(function(e){
        selectModel = getModel(mySwiper.realIndex);
        $("#showCamera").removeClass('hide');
    });
    $("#refresh").click(function(e){
        // document.querySelector('#creatImgCover').src = '';
        $('#page2').hide();
        $('#page1').show();
        $("#showCamera").addClass('hide');
    });
    $("#cameraWrap").click(function(e){
        e.target.className != 'close' ? 
        $('#file').click()
        :$("#showCamera").addClass('hide');
    });
    
    fileInit();
});


const $file = $('#file');
const maxSize = 500 * 1024;

function fileInit() {
    // 判断浏览器是否支持FileReader接口
    if (typeof window.FileReader == 'undefined') {
      showToast('你的浏览器版本太低！', '请更换浏览器再试试!');
      $file[0].setAttribute('disabled', 'disabled');// 使选择控件不可操作
      $('.chooseBtn').addClass('forbid');
    }
    $file[0].onchange = function () {
      const file = this.files[0];
  
      tool.loadshow();
      if (!file) {
        tool.loadhide();
        return false;
      } else if(!/\image\/(png|jpg|jpeg)$/.test(file.type)){
        showToast('请上传jpg或png格式图片');
        tool.loadhide();
        return false;
      }
      const reader = new window.FileReader();
  
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        $file.val('');
        let imgBase64 = reader.result;
  
        if (file.size > maxSize) {
          minish.minish(imgBase64,function (Base64) {
            imgBase64 = Base64;
           up(imgBase64);
          });
        }else{
          up(imgBase64);
        }
  
        function up(imgBase64){
            /*移除*/
            tool.loadhide()
            $('#page1').hide();
            $('#page2').show();
            showToast('请扫二维码获得更好体验');
            $('#creatImgCover').css('height','80vw')
            return            
            /*移除*/

            var base64ImageContent = imgBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            var blob = base64ToBlob(base64ImageContent, 'image/jpg');
            var formData = new FormData();
            formData.append('picture', blob);
            formData.append('isupload', 1);//删除默认上传
            formData.append('model', selectModel.toString());
            $.ajax({
                url: '/upload',
                type: "POST",
                cache: false,
                dataType:'json',
                contentType: false,
                processData: false,
                data: formData})
            .done(function(res){                
              console.log('mergeDone',res,typeof res);
              $('#page1').hide();
              $('#page2').show();
              document.querySelector('#creatImgCover').src = `${res.data.url}`; // base64png
              setTimeout(()=>tool.loadhide(),300);
              
            })
            .fail(function(res){
              setTimeout(()=>tool.loadhide(),300);
              console.log('fail',res,typeof res);
              showToast(res.responseJSON.message || '抱歉，服务器出错啦!');
            });
           }
  
  
      };
      return false;
    };
  
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
