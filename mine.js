'use strict';

let fs = require('fs');
let path = require('path');

/* global minejs */
global.minejs = {};
minejs.network = {};
minejs.utils = {};
minejs.ANSI = true;

/** 인코딩 관련 확장을 추가합니다. **/
var iconv = require('iconv-lite');

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