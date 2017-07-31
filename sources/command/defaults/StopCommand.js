/* global minejs */
class StopCommand extends minejs.command.CommandBase {
    constructor() {
        super({
            permissionDescription: 'Default',
            name: 'stop',
            usage: '<Delay Time(s)>',
            description: 'This command is used to stop the server.'
        });
    }
    process() {
        minejs.Server.getServer().masterExecute(() => {
            minejs.Server.getServer().restartFlag = false;
        });
        process.send([minejs.network.ProcessProtocol.SHUTDOWN]);
    }
    isOnceRun() {
        return true;
    }
}

new StopCommand();
minejs.command.defaults.StopCommand = StopCommand;
