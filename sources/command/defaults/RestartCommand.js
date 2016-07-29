'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.command.defaults.RestartCommand = class RestartCommand extends minejs.command.CommandBase{
            constructor(){
                super({
                    commandName: 'restart',
                    commandUsage: '<Delay Time(s)>',
                    commandDesciption: 'This command is used to restart the server.'
                });
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