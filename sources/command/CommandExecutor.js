/* global minejs */
class CommandExecutor {
    constructor() {}
    /**
     * @param {minejs.command.CommandSender} sender
     * @param {minejs.command.CommandBase} command
     * @param {string} label
     * @param {array} args
     * 
     * @return {boolean}
	 */
	 onCommand(sender, command, label, args) {}
}

minejs.command.CommandExecutor = CommandExecutor;