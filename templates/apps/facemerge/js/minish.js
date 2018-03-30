
function minish(url, callback , outputFormat){
  var canvas = document.createElement('CANVAS');
  // var canvas = document.getElementById('c'); //2、找到父级元素
  var ctx = canvas.getContext('2d');
  var img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    var width = img.width;
    var height = img.height;
    // var rate = (width<height ? width/height : height/width)/1;//按比例压缩
    var rate = 1000000/url.length < 1 ? 1000000/url.length :0.95;
    // console.log('?',width,height,rate);//442 607 0.18
    canvas.width = width*rate;
    canvas.height = height*rate;
    ctx.drawImage(img,0,0,width,height,0,0,width*rate,height*rate);
    var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg',1);
    // console.log(url.length/1024,dataURL.length/1024,dataURL.length/url.length);

    rate = 500/width < 0 ? 300/width :0.95;
    if(dataURL.length > 500 * 1024){
      minish(dataURL,callback)
    }else{
      callback(dataURL);
    }
    canvas = null;
  };
  img.src = url;
}


module.exports = {
  minish,
};
