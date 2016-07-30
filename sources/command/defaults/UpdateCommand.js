'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.command.defaults.UpdateCommand = class UpdateCommand extends minejs.command.CommandBase{
            constructor(){
                super({
                    name: 'update',
                    usage: '<Delay Time>',
                    description: 'This command is used to update the server.'
                });
            }
            process(){
                minejs.Server.getServer().masterExecute(()=>{
                    minejs.utils.Updater.getInstance().downloadUpdate();
                });
            }
            isOnceRun(){
                return true;
            }
        };
        new minejs.command.defaults.UpdateCommand();
    }
};