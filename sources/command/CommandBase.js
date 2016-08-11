/* global minejs */

class CommandBase {
    constructor(settings) {
        if (!settings) return false;
        if (!settings.name) return false;
        if (!settings.description) return false;
        if (!settings.usage) settings.usage = '';

        this._name = settings.name;
        this.__usage = settings.usage;
        this.__description = settings.description;
        this._permission = null;
        this._permissionMessage = null;

        minejs.command.CommandManager.getInstance().registerCommand(settings, this, this.isOnceRun());
        return true;
    }

    getName() {
        return this._name;
    }

    getDescription() {
        return this.__description;
    }

    getUsage() {
        return this.__usage;
    }
}

minejs.command.CommandBase = CommandBase;
