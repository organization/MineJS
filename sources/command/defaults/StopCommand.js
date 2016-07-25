'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.command.defaults.StopCommand = class StopCommand extends minejs.command.CommandBase{
            constructor(){
                super('stop');
            }
            process(){
                minejs.Server.getServer().masterExecute(()=>{
                    minejs.Server.getServer().restartFlag = false;
                });
                process.send([minejs.network.ProcessProtocol.SHUTDOWN]);
            }
            isOnceRun(){
                return true;
            }
        }
        new minejs.command.defaults.StopCommand();
    }
}