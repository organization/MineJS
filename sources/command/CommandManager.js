'use strict';

/* global minejs */
module.exports = {
    onLoad: () => {
        var __commandManagerInstance = null;
        minejs.command.CommandManager = class CommandManager{
            constructor(){
                this.__commandMap = {};
                this.__commandType = {};
            }
            static getInstance(){
                if(!__commandManagerInstance)
                    __commandManagerInstance = new this();
                return __commandManagerInstance;
            }
            registerCommand(commandName, process){
                this.registerCommand(commandName, process, false);
            }
            registerCommand(commandName, process, type){
                commandName = this.__slashRemove(commandName);
                commandName = commandName.toLowerCase();
    
                this.__commandMap[commandName] = process;
                this.__commandType[commandName] = type;
            }
            
            /** 한번만 실행되어야하는 명령어인지 확인합니다. **/
            checkIsOnceRun(commandName) {
                commandName = this.__slashRemove(commandName);
                return (this.__commandType[commandName] == null) ? true : this.__commandType[commandName];
            }
            
            process(commandName, args) {
                var lang = minejs.Server.getServer().getLang();
                commandName = this.__slashRemove(commandName);
                commandName = commandName.toLowerCase();
                /** 등록된 명령어라면 실행하고 아니면 /help 명령어 사용을 유도합니다. **/
                if(typeof(this.__commandMap[commandName]) == 'function'){
                    this.__commandMap[commandName](args);
                }else{
                    minejs.Server.getServer().getLogger().notice(lang.unknown_command, true);
                }
            }
            
            /** /가 명령어 앞에 포함된 경우 /만 잘라냅니다. **/
            __slashRemove(commandName){
                commandName = String(commandName);
                if(commandName.substring(0, 1) == '/'){
                    commandName = commandName.substring(1, commandName.length + 1);
                }
                return commandName;
            }
        }
    }
};