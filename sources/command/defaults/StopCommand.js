'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.command.defaults.StopCommand = class StopCommand extends minejs.command.CommandBase{
            constructor(){
                super({
                    name: 'stop',
                    usage: '<Delay Time(s)>',
                    description: 'This command is used to stop the server.'
                });
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
        };
        new minejs.command.defaults.StopCommand();
    }
};