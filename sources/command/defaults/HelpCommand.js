/* global minejs */
class HelpCommand extends minejs.command.CommandBase {
    constructor() {
        super({
            name: 'help',
            usage: '<Index>',
            description: 'It displays a list of server commands.'
        });
        this.format = "%permissionDescription% /%commandName% %commandUsage%\r\n└ %commandDesciption%";
    }

    process() {
        let logger = minejs.Server.getServer().getLogger();
        let details = minejs.command.CommandManager.getInstance().getCommandsDetail();

        for (let key in details) {
            let detail = details[key];
            logger.log(null, this.format
                .replace('%commandName%', detail.name)
                .replace('%commandUsage%', detail.usage)
                .replace('%commandDesciption%', detail.description) +
                '\r\n', null, true);
        }
    }

    isOnceRun() {
        return true;
    }
}

new HelpCommand();
minejs.command.defaults.HelpCommand = HelpCommand;
