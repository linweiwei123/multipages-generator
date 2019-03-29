const path = require('path');
const clientEntryModules = require('../modules-client');
const serverEntryModules = require('../modules-server');

function readClientEntrys(moduleBS, pageBS){
    var entrys = {};
    for(var key in clientEntryModules){
        if(key.indexOf(`${moduleBS}-`) !== -1){
            entrys[key] = clientEntryModules[key]
        }
    }
    return entrys;
}

function readServerEntrys(moduleBS, pageBS){
    var entrys = {};
    for(var key in serverEntryModules){
        if(key.indexOf(`${moduleBS}-`) !== -1){
            let page = key.split('-')[1];
            entrys[`${page}-server`] = path.resolve(serverEntryModules[key]);
        }
    }
    return entrys;
}

module.exports = {
    readClientEntrys,
    readServerEntrys
};