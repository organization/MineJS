/* global minejs */
class PermissionAttachment {
    /**
     * @param {minejs.plugin.Plugin} plugin
     * @param {minejs.permission.Permissible} permissible
     */
    constructor(plugin, permissible) {
        /**
         * @return {minejs.permission.PermissionRemovedExecutor}
         */
        this._removed = null;

        /**
         * @return {minejs.permission.Permissible}
         */
        this._permissible = permissible != null ? permissible : null;

        this._permissions = {};
        this._plugin = plugin != null ? plugin : null;


        if (!plugin.isEnabled()) {
            //TODO
            //throw new PluginException("Plugin " + plugin.getDescription().getName() + " is disabled");
        }
    }

    /**
     * @return {minejs.plugin.Plugin}
     */
    getPlugin() {
        return this._plugin;
    }

    /**
     * @param {minejs.permission.PermissionRemovedExecutor} executor
     */
    setRemovalCallback(executor) {
        this._removed = executor;
    }

    /**
     * @return {minejs.permission.PermissionRemovedExecutor}
     */
    getRemovalCallback() {
        return this._removed;
    }

    /**
     * @return {object}
     */
    getPermissions() {
        return this._permissions;
    }

    clearPermissions() {
        this._permissions.clear();
        this._permissible.recalculatePermissions();
    }

    /**
     * @param {object} permissions
     */
    setPermissions(permissions) {
        for (let key in permissions) this._permissions.put(key, permissions[key]);
        this._permissible.recalculatePermissions();
    }

    /**
     * @param {array} permissions
     */
    unsetPermissions(permissions) {
        for (let node in permissions) this._permissions.remove(node);
        this._permissible.recalculatePermissions();
    }

    /**
     * @param {minejs.permission.Permission || string} permission
     * @param {boolean} value
     */
    setPermission(permission, value) {
        if (permission instanceof minejs.permission.Permission)
            permission = permission.getName();

        if (this._permissions.containsKey(permission)) {
            if (this._permissions.get(permission).equals(value)) {
                return;
            }
            this._permissions.remove(permission);
        }
        this._permissions.put(permission, value);
        this._permissible.recalculatePermissions();
    }

    /**
     * @param {minejs.permission.Permission || string} permission
     * @param {boolean} value
     */
    unsetPermission(permission, value) {
        if (permission instanceof minejs.permission.Permission)
            permission = permission.getName();

        if (this._permissions.containsKey(permission)) {
            this._permissions.remove(permission);
            this._permissible.recalculatePermissions();
        }
    }

    remove() {
        this._permissible.removeAttachment(this);
    }
}