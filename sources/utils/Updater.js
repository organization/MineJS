'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        var updaterInstance = null;
        minejs.utils.Updater = class Updater{
            constructor(){
                if(updaterInstance != null)
                    return updaterInstance;
                
                this.updater = new (require('auto-updater'))({
                    pathToJson: '',
                    autoupdate: false,
                    checkgit: true,
                    jsonhost: 'raw.githubusercontent.com',
                    contenthost: 'codeload.github.com',
                    progressDebounce: 0,
                    devmode: false
                });
                updaterInstance = this;
            }
            
            static getInstance(){
                if(!updaterInstance)
                    new this();
                return updaterInstance;
            }
        }
        minejs.utils.Updater.getInstance();
    }
}