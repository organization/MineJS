'use strict';

module.exports = {
    /* global minejs */
    onInit: ()=>{
        minejs.command.CommandBase = class CommandBase{
            constructor(settings){
                if(!settings) return false;
                if(!settings.commandName) return false;
                if(!settings.commandUsage) return false;
                if(!settings.commandDesciption) return false;
                
                this.commandName = settings.commandName;
                minejs.command.CommandManager.getInstance().registerCommand(settings, this, this.isOnceRun());
                return true;
            }
            
            getName(){
                return this.commandName;
            }
        };
    }
};