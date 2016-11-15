'use strict';

/**
 * @description
 * The program starting point.
 * 프로그램 시작점입니다.
 */
let init = () => {
    /**
     * @description
     * Logger used on a temporary basis.
     * 임시로 사용할 로거입니다.
     * @param {string} log
     */
    let tempLogger = log => {
        let now = new Date();
        let timeFormat = String();
        timeFormat += (String(now.getHours()).length > 1 ? now.getHours() : '0' + now.getHours());
        timeFormat += ':' + (String(now.getMinutes()).length > 1 ? now.getMinutes() : '0' + now.getMinutes());
        timeFormat += ':' + (String(now.getSeconds()).length > 1 ? now.getSeconds() : '0' + now.getSeconds()) + "";
        let defaultFormat = String.fromCharCode(0x1b) + "[31;1m" + "[%time%] " + String.fromCharCode(0x1b) + "[37;1m" + "%log%";
        console.log(defaultFormat.replace('%time%', timeFormat).replace('%log%', log));
    }

    /**
     * @description
     * Load the data needs to run the app.
     * 앱을 실행하는데 필요한 자료들을 로드합니다.
     */
    let load = () => {
        let fs = require('fs');
        let path = require('path');

        /* global minejs */
        /** @namespace */
        global.minejs = {};

        /**
         * @description
         * The default program information.
         * 프로그램 기본정보입니다.
         */
        minejs.VERSION = "1.0";
        minejs.MINECRAFT_VERSION = "0.15";
        minejs.API_VERSION = "1.0.0";
        minejs.CODENAME = "유성(meteor)";
        minejs.PLUGIN_PATH = __dirname + '/plugins';

        minejs.ANSI = true;

        /**
         * @description
         * It is a node program loader. it helps available
         * manage source system like a Object-Oriented form.
         * OOP 형태로 노드 프로그램 소스파일 체계를
         * 관리할 수 있도록 돕는 프로그램 로더입니다.
         */

        let Module = module.constructor;
        global.minejs.loader = {

            /**
             * @description
             * This variable is stored plugins/programs sources folder address.
             * 이곳에 각 플러그인/프로그램의 소스폴더 주소가 담깁니다.
             */
            sources: {},

            /**
             * @description
             * Loaded JS files will be stored this variable. 'Path': (loaded module instance)
             * 로딩된 JS파일들이 담깁니다. '경로명': (불려와진모듈) 의 형태로 저장됩니다.
             */
            modules: {},

            /**
             * @description
             * Create a sub-variables In a global variable as the actual folder hierarchy.
             * 글로벌 변수에 실제 폴더계층대로 하위 변수를 생성합니다.
             * @param {string} sourceFolderPath
             * @param {string} originPath
             * @param {string} prefix
             */
            treeLoader: (sourceFolderPath, originPath, prefix) => {
                fs.readdirSync(sourceFolderPath).forEach(function(file) {
                    let filePath = path.join(sourceFolderPath, file);
                    let stat = fs.statSync(filePath);
                    try {
                        let tree = sourceFolderPath.split(originPath)[1];
                        tree = prefix + tree.replace(new RegExp("/", 'g'), '.');
                        tree = tree.replace(/\\/g, '.');
                        tree = tree.replace(/[&\/\\#,+()$~%;@$^!'":*?<>{}]/g, '');
                        if (eval("!" + tree))
                            eval(tree + " = {};");
                        if (stat.isDirectory())
                            global.minejs.loader.treeLoader(filePath, originPath, prefix);
                    }
                    catch (e) {}
                });
            },

            requireFromString: (tree, className, code, filePath) => {
                try {
                    code = 'module.exports={load:()=>{' + code + ';' + tree + '=' + className + ';}}';
                    let paths = module.constructor._nodeModulePaths(path.dirname(filePath));
                    let moduleBuild = new module.constructor(filePath, module.parent);

                    moduleBuild.filename = filePath;
                    moduleBuild.paths = [].concat(['prepend']).concat(paths).concat(['append']);
                    moduleBuild._compile(code, filePath);

                    let moduleInstance = moduleBuild.exports;
                    if (moduleInstance == null || typeof(moduleInstance.load) != 'function') return;

                    moduleInstance.load();
                    global.minejs.loader.modules[filePath] = moduleInstance;
                }
                catch (e) {
                    console.log('\r\n' + filePath + '\r\n\t' + e);
                }
            },

            /**
             * @description
             * Load all the source files in the specified folder.
             * 지정된 폴더 안에 있는 모든 소스파일들을 로드해옵니다.
             * @param {string} sourceFolderPath
             */
            sourceLoader: (sourceFolderPath, originPath, prefix) => {
                fs.readdirSync(sourceFolderPath).forEach(function(file) {
                    let filePath = path.join(sourceFolderPath, file);
                    let stat = fs.statSync(filePath);
                    try {
                        if (stat.isFile()) {
                            let tree = prefix + filePath.split(originPath)[1];
                            tree = tree.replace(/\.js/gi, '');
                            tree = tree.replace(new RegExp("/", 'g'), '.');
                            tree = tree.replace(/\\/g, '.');
                            
                            let extensionCheck = file.split('.');
                            if(extensionCheck.length < 2) return;
                            if(extensionCheck[1].toLowerCase() != 'js') return;

                            let targetClassName = file.replace(/\.js/gi, '');
                            global.minejs.loader.requireFromString(tree, targetClassName,
                                fs.readFileSync(filePath, 'utf8'), filePath);
                        }
                        else {
                            global.minejs.loader.sourceLoader(filePath, originPath, prefix);
                        }
                    }
                    catch (e) {}
                });
            },

            /**
             * @description
             * This function is load the required source.
             * Use when there are dependencies with sources.
             * 종속성이 있는 소스가 있을때 필요한 소스를 바로 로드합니다.
             * @param {string} requireSourcePath
             */
            requireLoader: requireSourcePath => {
                let splitPath = requireSourcePath.split(".");
                let prefix = null;
                let prefixCount = 0;

                for (let checkCount = 0; checkCount < splitPath.length; checkCount++) {
                    let checkPrefix = "";
                    for (let i = 0; i <= checkCount; i++) {
                        if (i != 0) checkPrefix += ".";
                        checkPrefix += splitPath[i];
                    }
                    if (global.minejs.loader.sources[checkPrefix] != null) {
                        prefix = checkPrefix;
                        prefixCount = checkCount;
                        break;
                    }
                }

                if (!prefix) return false;

                let requireAbsolutePath = "";
                for (let key in splitPath)
                    if (key > prefixCount) requireAbsolutePath += ("/" + splitPath[key]);
                let path = global.minejs.loader.sources[prefix] + requireAbsolutePath;

                /**
                 * @description
                 * If the source is already loaded, not loaded.
                 * 이미 로드된 소스일 경우 로드하지 않습니다.
                 */
                if (global.minejs.loader.modules[path] != null) return;

                global.minejs.loader.requireFromString(requireSourcePath, splitPath[splitPath.length - 1],
                    fs.readFileSync(path + '.js', 'utf8'), path + '.js');
                //let preLoadModule = require(path);
                //if (typeof(preLoadModule.onInit) === 'function') preLoadModule.onInit();
                //if (typeof(preLoadModule.onLoad) === 'function') preLoadModule.onLoad();
                //global.minejs.loader.modules[path] = preLoadModule;
                return true;
            },

            /**
             * @description
             * Register the source folder with the desired namespace.
             * You can only sentence like minejs, develper_name.plugin_name
             * like also possible to attach the name of the plugin developers behind the name.
             * Must register the namespace with the source folder, you can use the function dependencies.
             *
             * 소스폴더를 원하는 네임스페이스와 함께 등록합니다.
             * minejs 와 같이 단문장도 되고, develper_name.plugin_name
             * 같이 개발자명 뒤에 플러그인이름을 붙이는 것도 가능합니다.
             * 네임스페이스와 소스폴더를 등록해야만 종속성 함수를 사용할 수 있습니다.
             *
             * @param {string} prefix
             * @param {string} directory
             */
            registerSourceFolder: (prefix, directory) => {
                global.minejs.loader.sources[prefix] = directory;
            },

            /**
             * @description
             * PID list of workers are stored in this variable.
             * 워커들의 PID목록이 이 변수에 저장됩니다.
             */
            pids: {},

            /**
             * @description
             * Save the PID list of workers using this function.
             * 워커의 PID 목록을 이 함수를 이용해 저장합니다.
             * @param {array} pidList
             */
            putPids: pidList => {
                for (let key in pidList)
                    if (!global.minejs.loader.pids[pidList[key]])
                        global.minejs.loader.pids[pidList[key]] = true;
            },

            /**
             * @description
             * Returns PID list of workers.
             * 워커들의 PID목록을 반환합니다.
             * @returns {array}
             */
            getPids: () => Object.keys(global.minejs.loader.pids),

            /**
             * @description
             * Among active Workers, randomly specified worker and get the PID of worker.
             * 작동중인 워커 중에서, 랜덤하게 한 워커의 PID를 얻어옵니다.
             * @returns {integer}
             */
            getRandomPid() {
                let pidList = global.minejs.loader.getPids();
                if (!Array.isArray(pidList) || !pidList.length) return process.pid;

                let randomIndex = Math.floor(Math.random() * (pidList.length - 1));
                return pidList[randomIndex];
            }
        };

        /**
         * @description
         * Specify the source folder location.
         * 소스폴더 위치를 지정합니다.
         */
        let sourceFolder = path.join(__dirname, "sources");

        /**
         * @description
         * Register the source folder.
         * 소스폴더를 등록합니다.
         */
        global.minejs.loader.registerSourceFolder("minejs", sourceFolder);

        /**
         * @description
         * Create a source tree.
         * 소스트리를 생성합니다.
         */
        global.minejs.loader.treeLoader(sourceFolder, sourceFolder, "minejs");

        /**
         * @description
         * Load the source files.
         * 소스파일들을 불러옵니다.
         */
        global.minejs.loader.sourceLoader(sourceFolder, sourceFolder, "minejs");

        /**
         * @description
         * Run the load function in a module.
         * 모듈 안의 로드함수를 실행합니다.
         */
        for (let key in global.minejs.loader.modules)
            if (typeof(global.minejs.loader.modules[key].onInit) === 'function') global.minejs.loader.modules[key].onInit();
        for (let key in global.minejs.loader.modules)
            if (typeof(global.minejs.loader.modules[key].onLoad) === 'function') global.minejs.loader.modules[key].onLoad();

        var restart = func => setup(false, func);

        /**
         * @description
         * Create a master server instance.
         * 마스터 서버 인스턴스를 생성합니다.
         */
        var start = () => {
            /**
             * @description
             * Run Server initiate method
             * 서버의 시작 함수를 실행합니다.
             */
            new minejs.Server(__dirname, require(__dirname + '/settings.json'), restart);
        };

        let isLangDataExist = false;
        /**
         * @description
         * Select the language to use on the server.
         * 서버에서 사용할 언어를 선택합니다.
         */
        try {
            let stat = fs.statSync(__dirname + '/settings.json');
            isLangDataExist = true;
        }
        catch (e) {
            try {
                var langList = require(__dirname + "/resources/language-list.json");
            }
            catch (e) {
                tempLogger("Can't find /resources/language-list.json file.");
                tempLogger("Program basic resources doesn't exist! failed statup!");
                return;
            }

            tempLogger('Please select the language you want to use.');
            for (let lang in langList) tempLogger(`${lang} (${langList[lang]})`);

            /**
             * @description
             * Implement a console input to use language selection.
             * 언어선택을 위해 콘솔 입력을 구현합니다.
             */
            var readline = require('readline');
            var line = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            /**
             * @description
             * When enter the determined language, load the language file.
             * 결정된 언어명이 입력되면 해당 언어파일을 불러옵니다.
             */
            line.on('line', function(input) {
                if (!langList[input]) {
                    tempLogger('These language is not support. please check up the list.\n');
                    tempLogger('Please select the language you want to use.');
                    for (let lang in langList) tempLogger(`${lang} (${langList[lang]})`);
                }
                else {
                    /**
                     * @description
                     * Generate Server UUID.
                     * 서버의 UUID를 생성합니다.
                     */
                    let settings = require(__dirname + "/resources/lang/" + input + "/settings.json");
                    let lang = require(__dirname + "/resources/lang/" + input + "/lang.json");
                    if (!settings.server_uuid)
                        settings.server_uuid = require('node-uuid').v4();

                    fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, 4), 'utf8');
                    fs.writeFileSync(__dirname + '/lang.json', JSON.stringify(lang, null, 4), 'utf8');
                    line.close();
                    start();
                }
            });
        }

        if (isLangDataExist) start();
    };

    /**
     * @description
     * When need to install a module before server run, call this function.
     * 서버 실행 전 모듈을 설치할때 해당 함수를 호출합니다.
     */
    let setup = (needLoad, func) => {
        /**
         * @description
         * Bring up a list of modules, and examine the list of modules that are not ready.
         * 모듈목록을 불러온 후, 준비되지 않은 모듈목록을 조사합니다.
         */
        let cp = require('child_process');
        let packageList = require(__dirname + '/package.json');

        let notInstalledModules = [];
        let baseCache = {};

        for (let key in require.cache) baseCache[key] = true;

        for (let packageName in packageList.dependencies) {
            let packageVersion = packageList.dependencies[packageName];
            packageVersion = packageVersion.replace(/[&\/\\#,+()$~%;@$^!'":*?<>{}]/g, '');
            let loadTest;
            let loadVersion;
            try {
                loadTest = require(packageName);
                loadVersion = require(__dirname + `/node_modules/${packageName}/package.json`).version;
                loadVersion = loadVersion.replace(/[&\/\\#,+()$~%;@$^!'":*?<>{}]/g, '');
                if (packageVersion != loadVersion) notInstalledModules.push(packageName);
            }
            catch (e) {
                if (!loadTest) notInstalledModules.push(packageName);
            }
        }

        for (let key in require.cache)
            if (!baseCache[key]) delete require.cache[key];
        baseCache = null;

        /**
         * @description
         * After installing the modules to load the program.
         * 모듈을 모두 설치한 후 프로그램을 로드합니다.
         */
        let moduleCount = notInstalledModules.length;
        let modulesInstallChecker = body => {
            tempLogger(`Module installed: ${body}`);
            if (--moduleCount == 0) {
                tempLogger('All modules prepared. MineJS now started..');
                load();
            }
        };

        /**
         * @description
         * If the node module is not ready then automatically
         * download and install the node module and turn on the server.
         * 노드 모듈이 준비되어있지 않은 경우 노드모듈을
         * 자동으로 다운로드 및 설치한 후 서버를 켭니다.
         */
        if (notInstalledModules.length > 0) {
            tempLogger(`MineJS new node module updates has detected! (total ${notInstalledModules.length})`);
            tempLogger("MineJS will be started in few seconds later\r\n");

            notInstalledModules.forEach(module => {
                tempLogger(`Downloading module '${module}'...`);

                cp.exec(`npm install ${module}`, (err, body) => {
                    if (err) {
                        tempLogger('An error occurred while preparing a base module.');
                        tempLogger('Can not execute the program. The base module was not prepared.');
                        tempLogger(err);
                        process.exit();
                        return;
                    }

                    modulesInstallChecker(body);
                });
            });
        }

        else if (needLoad) load();
        else if (func != null) func();
    };

    /**
     * @description
     * Run the module installation function.
     * 모듈 설치함수를 실행합니다.
     */
    setup(true);
};

/**
 * @description
 * Run the server initiate function.
 * 서버 시작함수를 실행합니다.
 */
init();
