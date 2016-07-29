'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.command.defaults.HelpCommand = class HelpCommand extends minejs.command.CommandBase{
            constructor(){
                super({
                    commandName: 'help',
                    commandUsage: '<Index>',
                    commandDesciption: 'It displays a list of server commands.'
                });
                this.format = "%permissionDescription% /%commandName% %commandUsage%\r\n└ %commandDesciption%";
            }
            
            process(){
                let logger = minejs.Server.getServer().getLogger();
                let details = minejs.command.CommandManager.getInstance().getCommandsDetail();
                
                for(let key in details){
                    let detail = details[key];
                    logger.log(null, this.format
                        .replace('%commandName%', detail.commandName)
                        .replace('%commandUsage%', detail.commandUsage)
                        .replace('%commandDesciption%', detail.commandDesciption)
                    + '\r\n', null, true);
                }
            }
            
            isOnceRun(){ return true; }
        };
        new minejs.command.defaults.HelpCommand();
    }
};