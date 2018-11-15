module.exports = {

    // 启动的客户端服务器端口
    clientPort: '8080',

    // 服务端服务器端口
    server: {
        port: '8090',
    },

    // 上传相关配置
    upload: {
        cdn: '//cnd.yintage.com/',
        projectPrefix: 'nodejs-common',

        // 如果是阿里云，则aliconfig配置一个空对象，目前采用.aliossacess 文件配置的方式
        // aliconfig: {
        //
        // },
        // 七牛云

        qconfig: {
            ACCESS_KEY: 'ei1uOdGpVLliA7kb50sLcV9i4wfYLPwt5v0shU10',
            SECRET_KEY: '-pFFIY-ew35Exyfcd67Sbaw40k15ah3UfZTFWFKF',
            bucket:'hotshots-image',
            origin:'http://cnd.yintage.com'
        },

        // 是否编译后自动上传
        autoUpload: true

    }
};