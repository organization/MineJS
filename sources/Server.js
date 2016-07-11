'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        var serverInstance = null;
        minejs.Server = class Server{
            constructor(path){
                if(!serverInstance) {
                    serverInstance = this;
                    this._init(path);
                }
                return serverInstance;
            }
            static getServer(){
                if(!serverInstance)
                    new this();
                return serverInstance;
            }
            getOs(){
                return require('os');
            }
            getFs(){
                return require('fs');
            }
            getPath(){
                return require('path');
            }
            getCluster(){
                return require('cluster');
            }
            getLogger() {
                return this.logger;
            }
            getCommandManager() {
                return this._commandManager;
            }
            _init(path) {
                this.datapath = path;
                this.logger = new minejs.utils.MainLogger(null, this.datapath, false);
                this.getLogger().notice('hi');
                
                if(this.getCluster().isMaster){
                    
                }
                if(this.getCluster().isWorker){
                    
                }
            }
        };
    }
}