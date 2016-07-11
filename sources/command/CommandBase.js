'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.command.CommandBase = class CommandBase{
            constructor(commandName){
                this.commandName = commandName;
                minejs.command.CommandManager.getInstance().registerCommand(commandName, this.process, this.isOnceRun());
            }
            getName(){
                return this.commandName;
            }
        }
    }
}