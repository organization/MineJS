'use strict';

module.exports = {
    /* global minejs */
    onEnable: ()=>{
        var updaterInstance = null;
        minejs.utils.Updater = class Updater{
            constructor(){
                if(minejs.Server.getServer().getCluster().isWorker)
                    return null;
                if(updaterInstance != null)
                    return updaterInstance;
                    
                let lang = minejs.Server.getServer().getLang();
                let logger = minejs.Server.getServer().getLogger();
                
                this.updater = new (require('auto-updater'))({
                    pathToJson: '',
                    autoupdate: false,
                    checkgit: false,
                    jsonhost: 'raw.githubusercontent.com',
                    contenthost: 'codeload.github.com',
                    progressDebounce: 0,
                    devmode: false
                });
                this.updater.on('check.up-to-date', function(v) {
                    logger.info(lang.updater_now_latest_version.replace('%version%', v));
                });
                this.updater.on('check.out-dated', function(v_old, v) {
                    logger.info(lang.updater_now_outdated_version.replace('%version%', v_old));
                    logger.info(lang.updater_you_can_use_update_command);
                });
                this.updater.on('update.downloaded', function() {
                    logger.info(lang.updater_download_complete_now_extract);
                    this.updater.fire('extract');
                });
                this.updater.on('update.not-installed', function() {
                    logger.info(lang.updater_download_complete_now_extract);
                    this.updater.fire('extract');
                });
                this.updater.on('update.extracted', function() {
                    logger.info(lang.updater_update_complete);
                    logger.info(lang.updater_please_restart_app);
                });
                this.updater.on('download.start', function(name) {
                    logger.info(lang.updater_now_downloading.replace('%file%', name));
                });
                this.updater.on('download.error', function(err) {
                    logger.info(lang.updater_error_in_download);
                    logger.info(err);
                });
                this.updater.on('error', function(name, err) {
                    logger.info(lang.updater_error_in_update);
                    logger.info(name + ':' + err);
                });
                
                this.updater.fire('check');
                updaterInstance = this;
            }
            
            downloadUpdate(){
                this.updater.fire('download-update');
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