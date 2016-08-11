/* global minejs */
class RestartCommand extends minejs.command.CommandBase {
    constructor() {
        super({
            name: 'restart',
            usage: '<Delay Time(s)>',
            description: 'This command is used to restart the server.'
        });
    }
    process() {
        minejs.Server.getServer().masterExecute(() => {
            minejs.Server.getServer().restartFlag = true;
        });
        process.send([minejs.network.ProcessProtocol.SHUTDOWN]);
    }
    isOnceRun() {
        return true;
    }
}

new RestartCommand();
minejs.command.defaults.RestartCommand = RestartCommand;
