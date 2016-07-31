/* global minejs */
minejs.loader.requireLoader("minejs.permission.ServerOperator");
minejs.loader.requireLoader("minejs.permission.Permission");

class Permissible extends minejs.permission.ServerOperator {
    /**
     * @param {string} name
     * @return {boolean}
     */
    isPermissionSet(name) {}

    /**
     * @param {minejs.permission.Permission} permission
     * @return {boolean}
     */
    isPermissionSet(permission) {}

    /**
     * @param {Permission || String} permission
     * @return {boolean}
     */
    hasPermission(permission) {}

    /**
     * @param {minejs.plugin.Plugin} plugin
     * @param {string} name
     * @param {boolean} value
     * @return {minejs.permission.PermissionAttachment}
     */
    addAttachment(plugin, name, value) {}

    /**
     * @param {minejs.permission.PermissionAttachment} attachment
     */
    removeAttachment(attachment) {}

    recalculatePermissions() {}

    /**
     * @return {object}
     */
    getEffectivePermissions() {}
}