'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.command.defaults.RestartCommand = class RestartCommand extends minejs.command.CommandBase{
            constructor(){
                super('restart');
            }
            process(){
                minejs.Server.getServer().masterExecute(()=>{
                    minejs.Server.getServer().restartFlag = true;
                });
                process.send([minejs.network.ProcessProtocol.SHUTDOWN]);
            }
            isOnceRun(){
                return true;
            }
        };
        new minejs.command.defaults.RestartCommand();
    }
};