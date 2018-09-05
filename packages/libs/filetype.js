const extension = {
    js: ['.js'],
    html: ['.html'],
    css: ['.css'],
    image: ['.png','.jpg','.webp','.gif','.svg'],
    media: ['.mp3','.mpa','.wav','.mp4','.wmv','.swf','.mov','.avi']
};

function detectExtension(ext){
    for(let key in extension){
        let typeArr = extension[key];
        if(typeArr.indexOf(ext)>-1){
            return key;
        }
    }
    return 'other';
}

module.exports = detectExtension;