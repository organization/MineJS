/* global minejs */

class ConsoleCommandSender extends minejs.command.CommandSender {
    constructor() {
        super();
        this._perm = new minejs.permission.PermissibleBase(this);
    }

    /**
     * @param {string} name
     * @return {boolean}
     */
    isPermissionSet(name) {
        return this._perm.isPermissionSet(name);
    }

    /**
     * @param {string} name
     * @return {boolean}
     */
    hasPermission(name) {
        return this._perm.hasPermission(name);
    }

    /**
     * @param {minejs.plugin.Plugin} plugin
     * @param {string} name
     * @param {object} value
     */
    addAttachment(plugin, name, value) {
        return this._perm.addAttachment(plugin, name, value);
    }

    /**
     * @param {minejs.permission.PermissionAttachment}
     */
    removeAttachment(attachment) {
        this._perm.removeAttachment(attachment);
    }

    recalculatePermissions() {
        this._perm.recalculatePermissions();
    }

    /**
     * @return {object}
     */
    getEffectivePermissions() {
        return this._perm.getEffectivePermissions();
    }

    /**
     * @return {boolean}
     */
    isPlayer() {
        return false;
    }

    /**
     * @return {minejs.Server}
     */
    getServer() {
        return minejs.Server.getInstance();
    }

    /**
     * @param {string} message
     */
    sendMessage(message) {
        if (message instanceof minejs.event.TextContainer)
            message = this.getServer().getLanguage().translate(message);
        message = this.getServer().getLanguage().translateString(message);
        for (let line in message.trim().split("\n"))
            minejs.utils.MainLogger.getLogger().info(line);
    }

    /**
     * @return {string}
     */
    getName() {
        return "CONSOLE";
    }

    /**
     * @return {boolean}
     */
    isOp() {
        return true;
    }

    /**
     * @param {boolean} value
     */
    setOp(value) {}
}

minejs.command.ConsoleCommandSender = ConsoleCommandSender;
