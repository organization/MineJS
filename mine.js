'use strict';

let fs = require('fs');
let path = require('path');

/* global minejs */
global.minejs = {};
minejs.ANSI = true;

minejs.VERSION = "1.0";
minejs.MINECRAFT_VERSION = "0.15";
minejs.API_VERSION = "1.0.0";
minejs.CODENAME = "유성(meteor)";
minejs.PLUGIN_PATH = __dirname + '/plugins';

/** 로딩된 모듈들이 담깁니다. **/
global.minejs.modules = {};
let loader = {
    treeLoader : function(sourceFolderPath, originPath, prefix) {
        fs.readdirSync(sourceFolderPath).forEach(function (file) {
            let filePath = path.join(sourceFolderPath, file);
            let stat = fs.statSync(filePath);
            try{
                let tree = sourceFolderPath.split(originPath)[1];
                tree = prefix + tree.replace(new RegExp("/", 'g'), '.');
                if(eval("!" + tree))
                    eval(tree + " = {};");
                if (stat.isDirectory())
                    loader.treeLoader(filePath, originPath, prefix);
            }catch(e){}
        });
    },
    sourceLoader: function (sourceFolderPath) {
        fs.readdirSync(sourceFolderPath).forEach(function (file) {
            let filePath = path.join(sourceFolderPath, file);
            let stat = fs.statSync(filePath);
            try{
                if (stat.isFile()) {
                    global.minejs.modules[filePath] = require(filePath);
                } else {
                    loader.sourceLoader(filePath);
                }
            }catch(e){}
        });
    }
};

/** 소스트리를 생성합니다. **/
let sourceFolder = path.join(__dirname, "sources");
loader.treeLoader(sourceFolder, sourceFolder, "minejs");

/** 소스파일들을 불러옵니다. **/
loader.sourceLoader(sourceFolder);

/** 서버가 로딩될 때 해당 코드를 실행합니다. **/
for (let key in global.minejs.modules)
    if (typeof(global.minejs.modules[key].onInit) === 'function') global.minejs.modules[key].onInit();
for (let key in global.minejs.modules)
    if (typeof(global.minejs.modules[key].onLoad) === 'function') global.minejs.modules[key].onLoad();


/** 서버를 시작시킬때 해당 함수를 실행합니다. **/
var start = () => {
    /** Run Server init method **/
    new minejs.Server(__dirname, require(__dirname + '/settings.json'));
};

/** 서버에서 사용할 언어를 선택합니다. **/
try{
    let stat = fs.statSync(__dirname + '/settings.json');
    start();
}catch(e){
    var langList = require(__dirname + "/resources/language-list.json");
    
    console.log('Please select the language you want to use.');
    for(let lang in langList) console.log(lang + " (" + langList[lang] + ")");
    
    /** 언어선택을 위해 콘솔 입력을 구현합니다. **/
    var readline = require('readline');
    var line = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    line.on('line', function (input) {
        if(!langList[input]){
            console.log('These language is not support. please check up the list.\n');
            console.log('Please select the language you want to use.');
            for(let lang in langList) console.log(lang + " (" + langList[lang] + ")");
        }else{
            /** 서버의 UUID를 생성합니다. **/
            let settings = require(__dirname + "/resources/lang/" + input + "/settings.json");
            let lang = require(__dirname + "/resources/lang/" + input + "/lang.json");
            if(!settings.server_uuid)
                settings.server_uuid = require('node-uuid').v4();
                
            fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 4), 'utf8');
            fs.writeFileSync(__dirname + '/lang.json', JSON.stringify(lang, null, 4), 'utf8');
            line.close();
            start();
        }
    });
}