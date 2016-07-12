'use strict';

let fs = require('fs');
let path = require('path');
let jsoncomments = require('json-comments');

/* global minejs */
global.minejs = {};
minejs.command = {};
minejs.command.defaults = {};
minejs.network = {};
minejs.database = {};

minejs.raknet = {};
minejs.raknet.protocol = {};
minejs.raknet.server = {};

minejs.raknet.server = {};
minejs.utils = {};
minejs.ANSI = true;

/** 로딩된 모듈들이 담깁니다. **/
global.minejs.modules = {};
let loader = {
    sourceLoader: function (sourceFolderPath) {
        fs.readdirSync(sourceFolderPath).forEach(function (file) {
            let filePath = path.join(sourceFolderPath, file);
            let stat = fs.statSync(filePath);
            if (stat.isFile()) {
                global.minejs.modules[filePath] = require(filePath);
            } else {
                loader.sourceLoader(filePath);
            }
        });
    }
};

/** 소스파일들을 불러옵니다. **/
loader.sourceLoader(path.join(__dirname, "sources"));

/** 서버가 로딩될 때 해당 코드를 실행합니다. **/
for (let key in global.minejs.modules) {
    if (typeof(global.minejs.modules[key].onLoad) === 'function') global.minejs.modules[key].onLoad();
}

/** Run Server init method **/
new minejs.Server(__dirname);