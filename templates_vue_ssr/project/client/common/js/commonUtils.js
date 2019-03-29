export function deepExtend(out) {
  out = out || {}

  for (var i = 1, len = arguments.length; i < len; ++i) {
    var obj = arguments[i]

    if (!obj) {
      continue
    }

    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue
      }

      // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
      if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
        out[key] = deepExtend(out[key], obj[key])
        continue
      }

      out[key] = obj[key]
    }
  }

  return out
}

/**
 * 深拷贝代码
 */
export function merge(/* obj1, obj2, obj3, ... */) {
  var result = {}
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val)
    } else {
      result[key] = val
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue)
  }
  return result
}

export function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj]
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}

function isArray(val) {
  return toString.call(val) === '[object Array]'
}

export function obj2KV(obj){
  let ret = [];
  for(let item in obj){
    ret.push({
      key: item,
      value: obj[item]
    })
  }
  return ret;
}
export function arrToObj(arr) {
  if (!isType(arr, 'array')) {
    console.log('不是数组')
    return {}
  }
  var obj = {};
  arr.forEach(item => {
    if (!obj.hasOwnProperty(item.id)){
      obj[item.id] = item.content;
    }
  })
  return obj;
}

export function isType(obj, type) {
  return Object.prototype.toString.call(obj).toLowerCase() === `[object ${type}]`;
}


// 判断输入框是否为空
export function isEmpty(val) {
  return val.split(" ").join("").length == 0 ? true : false
}

// 去掉字符串前后空格
export function trim(str)
 {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 下载导出
export function downloadFile(url) {
  try{
      var elemIF = document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      document.body.appendChild(elemIF);
  }catch(e){ }
}

export function getFileType(filePath) {
  var startIndex = filePath.lastIndexOf(".");
  if(startIndex != -1)
    return filePath.substring(startIndex+1, filePath.length).toLowerCase();
  else return "";
}

export function isImageFile(filename){
  const types = ['jpg', 'png'];
  const filetype = getFileType(filename);
  if(!filetype){
    return false;
  }
  return types.indexOf(filetype) !== -1;
}

export function isBrowser(){
    console.log('global.toString()',global.toString());
    return global.toString() === '[object Window]' || global.toString() === '[object DOMWindow]';
}