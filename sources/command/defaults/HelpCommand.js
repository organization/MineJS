'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.command.defaults.HelpCommand = class HelpCommand extends minejs.command.CommandBase{
            constructor(){
                super('help');
            }
            process(){
                //
            }
            isOnceRun(){
                return true;
            }
        }
    }
}