/** @description WRITE YOUR PROJECT PREFIX */
let prefix = "minejs";

/** @description WRITE YOUR PROJECT SOURCE FOLDER NAME*/
let sourceFolderName = "sources";

/** @description WRITE WHEN THE REPEAT COLLECT AUTOMATICALLY*/
let repeatTime = 10000;
/* ------------------------------------ */

let start = ()=>{
  let fs = require('fs');
  let path = require('path');

  let hierarchy = {};

  let prefixSplit = prefix.split('.');

  let tempPrefix = "";
  for (let index = 0; index < prefixSplit.length; index++) {
      if (index != 0) tempPrefix += '.';
      tempPrefix += prefixSplit[index];
      if (eval("!" + `hierarchy.${tempPrefix}`))
          eval(`hierarchy.${tempPrefix} = {};`);
  }

  let code =
      "// Convert the global variable hierarchy to js code.\r\n" +
      "// It makes ternjs can understand this project.\r\n" +
      "// just use command 'node collect', so IDE Intellisense will be work.\r\n" +
      `/** @namespace ${prefixSplit[0]} */\r\nvar ${prefixSplit[0]} = `;

  let hierarchyLoader = (sourceFolderPath, originPath, prefix) => {
      fs.readdirSync(sourceFolderPath).forEach(function(file) {
          let filePath = path.join(sourceFolderPath, file);
          let stat = fs.statSync(filePath);
          try {
              let tree = filePath.split(originPath)[1];
              tree = tree.replace(/\.js/gi, '');
              tree = prefix + tree.replace(new RegExp("/", 'g'), '.');
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

  let sourceFolderPath = path.join(__dirname, sourceFolderName);
  hierarchyLoader(sourceFolderPath, sourceFolderPath, prefix);
  code += eval(`JSON.stringify(hierarchy.${prefixSplit[0]})`).replace(/\"/g, '') + ";";
  fs.writeFile('header.js', code, 'utf8', function(error) {
      (error == null) ? console.log('collect complete!'): console.log(error);
  });
}

if(process.argv.length > 1 && process.argv[2] == "repeat"){
  start();
  setInterval(start, repeatTime);
}else{
  start();
}
