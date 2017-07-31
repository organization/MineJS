/* global minejs */
class UpdateCommand extends minejs.command.CommandBase {
    constructor() {
        super({
            permissionDescription: 'Default',
            name: 'update',
            usage: '<Delay Time>',
            description: 'This command is used to update the server.'
        });
    }
    process() {
        minejs.Server.getServer().masterExecute(() => {
            minejs.utils.Updater.getInstance().downloadUpdate();
        });
    }
    isOnceRun() {
        return true;
    }
}

new UpdateCommand();
minejs.command.defaults.UpdateCommand = UpdateCommand;
