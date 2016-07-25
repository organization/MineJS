'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.command.defaults.UpdateCommand = class UpdateCommand extends minejs.command.CommandBase{
            constructor(){
                super('update');
            }
            process(){
                minejs.Server.getServer().masterExecute(()=>{
                    minejs.utils.Updater.getInstance().downloadUpdate();
                });
            }
            isOnceRun(){
                return true;
            }
        }
        new minejs.command.defaults.UpdateCommand();
    }
}