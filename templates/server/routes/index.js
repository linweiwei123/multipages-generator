const demo = require('./demo');
//<@add page@>

module.exports.init = app =>{

    app.get('/demo', demo.index);
    //<@add page router@>

    return app;
};


