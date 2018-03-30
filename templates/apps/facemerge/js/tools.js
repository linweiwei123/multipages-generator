const $ = require('jquery');
const load = $('#load');
const storage = window.localStorage;

const isApp = (window.isApp = function () {
  const isInApp = /meetyouclient/g.test(window.navigator.userAgent.toLowerCase());

  // const isShare = window.searchParams.isShare === true ||
  // window.searchParams.isShare === 'true'; return isShare === false;
  return isInApp;
});

function loadshow() {
  load.removeClass('hide');
}

function loadhide() {
  load.addClass('hide');
}

// 获取url参数
function GetQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window
    .location
    .search
    .substr(1)
    .match(reg);

  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

let showToastSt = null;

// 吐司显示

function showToast(text, desc) {
  if (text) {
    $('.mzc-toast')
      .find('> div > div')
      .eq(0)
      .html(text || '');
  }
  $('.mzc-toast')
    .find('> div > div')
    .eq(1)
    .html(desc || '');

  setTimeout(function () {
    $('.mzc-toast').addClass('show');
  }, 50);

  clearTimeout(showToastSt);
  showToastSt = setTimeout(function () {
    $('.mzc-toast').removeClass('show');
  }, 2000);
}



// 验证手机号

function uploadImg(formData, cb) {
  const uploadDoneTimer = setTimeout(() => {
    loadhide();
    tipShow();
  }, 10000);

  consolelog('图片上传中...');
  $.ajax({
    url: '/beiqin/imageUpload',
    type: 'POST',
    cache: false,
    data: formData,
    processData: false,
    contentType: false,
    success: function name(res) {
      consolelog('上传成功', res);
      if (cb) {
        cb(res);
      }
      clearTimeout(uploadDoneTimer);
      loadhide();
      tipShow();
    }
  })
    .fail(function (res) {
      consolelog('上传fail', typeof (res), res);
      clearTimeout(uploadDoneTimer);
      loadhide();
      // tipShow();
      showToast('请求失败');
    });
}

module.exports = {
  loadshow,
  loadhide,
  showToast,
  uploadImg
};
