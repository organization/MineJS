/** @description
 * WRITE YOUR PROJECT PREFIX
 * IF EMPTY HERE, IT WILL BE MULTIPREFIX APPLIED.
 */
let prefix = "minejs";

/** @description WRITE YOUR PROJECT SOURCE FOLDER NAME*/
let sourceFolderName = "sources";

/** @description WRITE WHEN THE REPEAT COLLECT AUTOMATICALLY*/
let repeatTime = 5000;
/* ------------------------------------ */

let fs = require('fs');
let path = require('path');

let hierarchy = {};

let tempLogger = log => {
    let now = new Date();
    let timeFormat = String();
    timeFormat += (String(now.getHours()).length > 1 ? now.getHours() : '0' + now.getHours());
    timeFormat += ':' + (String(now.getMinutes()).length > 1 ? now.getMinutes() : '0' + now.getMinutes());
    timeFormat += ':' + (String(now.getSeconds()).length > 1 ? now.getSeconds() : '0' + now.getSeconds()) + "";
    let defaultFormat = String.fromCharCode(0x1b) + "[31;1m" + "[%time%] " + String.fromCharCode(0x1b) + "[37;1m" + "%log%";
    console.log(defaultFormat.replace('%time%', timeFormat).replace('%log%', log));
}

let hierarchyLoader = (sourceFolderPath, originPath, prefix) => {
    fs.readdirSync(sourceFolderPath).forEach(function(file) {
        let filePath = path.join(sourceFolderPath, file);
        let stat = fs.statSync(filePath);
        try {
            let tree = filePath.split(originPath)[1];
            let extension = path.extname(tree);
            if (stat.isFile() && extension != '.js' && extension != '.jsx') return;
            tree = tree.replace(`${extension}`, '');
            tree = prefix + tree.replace(/\//g, '.');
            tree = tree.replace(/\\/g, '.');
            tree = tree.replace(/[&\/\\#,+()$~%;@$^!'":*?<>{}]/g, '');

            let treeSplit = tree.split('.');
            let tempTree = "";
            for (let index = 0; index < treeSplit.length; index++) {
                if (index != 0) tempTree += '.';
                tempTree += treeSplit[index];
                if (eval("!" + `hierarchy.${tempTree}`))
                    eval(`hierarchy.${tempTree} = {};`);
            }
            if (stat.isDirectory())
                hierarchyLoader(filePath, originPath, prefix);
        } catch (e) {}
    });
}

let collectGlobalHierarchy = (prefix, sourceFolderName, needWriteDescription, sourceFolderPath) => {
    let prefixSplit = prefix.split('.');

    let tempPrefix = "";
    for (let index = 0; index < prefixSplit.length; index++) {
        if (index != 0) tempPrefix += '.';
        tempPrefix += prefixSplit[index];
        if (eval("!" + `hierarchy.${tempPrefix}`))
            eval(`hierarchy.${tempPrefix} = {};`);
    }

    let code = "";
    code += fs.readFileSync('header.js', 'utf8');

    if (needWriteDescription) {
        code +=
            "// Convert the global variable hierarchy to js code.\r\n" +
            "// It makes ternjs can understand this project.\r\n" +
            "// just use command 'node collect', so IDE Intellisense will be work.\r\n";
    }
    code += `\r\n/** @namespace ${prefixSplit[0]} */\r\nvar ${prefixSplit[0]} = `;

    if (sourceFolderPath === undefined) sourceFolderPath = path.join(__dirname, sourceFolderName);
    hierarchyLoader(sourceFolderPath, sourceFolderPath, prefix);
    code += eval(`JSON.stringify(hierarchy.${prefixSplit[0]}, null, 2)`).replace(/\"/g, '') + ";";
    fs.writeFileSync('header.js', code, 'utf8');
    tempLogger(`Global variable '${prefix}' collect complete!`);
}

let prefixLoad = () => {
    fs.writeFileSync('header.js', '', 'utf8');
    if (prefix.length != 0) {
        collectGlobalHierarchy(prefix, sourceFolderName, true);
    } else {
        let sourceFolderPath = path.join(__dirname, sourceFolderName);
        let countRead = 0;
        fs.readdirSync(sourceFolderPath).forEach(function(file) {
            let prefixFolderPath = path.join(sourceFolderPath, file);
            let stat = fs.statSync(prefixFolderPath);
            try {
                if (stat.isDirectory())
                    collectGlobalHierarchy(file, sourceFolderName, (countRead++ == 0) ? true : false, prefixFolderPath);
            } catch (e) {}
        });
        console.log('');
    }
}

if (process.argv.length > 1 && process.argv[2] == "repeat") {
    prefixLoad();
    setInterval(() => {
        prefixLoad();
    }, repeatTime);
} else {
    prefixLoad();
}
