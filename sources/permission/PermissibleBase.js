/* global minejs */

class PermissibleBase {
    /**
     * @param {minejs.permission.ServerOperator} opable
     */
    constructor(opable) {
        this.opable = opable;
        this._parent = null;
        this._attachments = {};
        this._permissions = {};

        if (opable instanceof minejs.permission.Permissible)
            this._parent = opable;
    }

    /**
     * @return {boolean}
     */
    isOp() {
        return this.opable != null && this.opable.isOp();
    }

    /**
     * @param {boolean} value
     */
    setOp(value) {
        if (this.opable == null) {
            //TODO
            //throw new ServerException("Cannot change op value as no ServerOperator is set");
        }
        else {
            this.opable.setOp(value);
        }
    }

    /**
     * @param {string} permission
     * @return {boolean}
     */
    isPermissionSet(permission) {
        if (permission instanceof minejs.permission.Permission)
            permission = permission.getName();
        return this._permissions.containsKey(permission);
    }

    /**
     * @param {string} name
     * @return {boolean}
     */
    hasPermission(name) {
        if (this.isPermissionSet(name)) {
            return this._permissions.get(name).getValue();
        }

        let perm = minejs.Server.getInstance().getPluginManager().getPermission(name);
        let Permission = minejs.permission.Permission;

        if (perm != null) {
            let permission = perm.getDefault();

            return Permission.DEFAULT_TRUE.equals(permission) || (this.isOp() && Permission.DEFAULT_OP.equals(permission)) || (!this.isOp() && Permission.DEFAULT_NOT_OP.equals(permission));
        }
        else {
            return Permission.DEFAULT_TRUE.equals(Permission.DEFAULT_PERMISSION) || (this.isOp() && Permission.DEFAULT_OP.equals(Permission.DEFAULT_PERMISSION)) || (!this.isOp() && Permission.DEFAULT_NOT_OP.equals(Permission.DEFAULT_PERMISSION));
        }
    }

    /**
     * @param {minejs.plugin.Plugin} plugin
     * @param {string} name
     * @param {boolean} value
     */
    addAttachment(plugin, name, value) {
        if (plugin == null) {
            //throw new PluginException("Plugin cannot be null");
        }
        else if (!plugin.isEnabled()) {
            //throw new PluginException("Plugin " + plugin.getDescription().getName() + " is disabled");
        }

        let result = new minejs.permission.PermissionAttachment(plugin, this.parent != null ? this.parent : this);
        this._attachments.add(result);
        if (name != null && value != null)
            result.setPermission(name, value);
        this.recalculatePermissions();

        return result;
    }

    /**
     * @param {minejs.permission.PermissionAttachment} attachment
     */
    removeAttachment(attachment) {
        if (attachment == null)
        //throw new IllegalStateException("Attachment cannot be null");

            if (this._attachments.contains(attachment)) {
            this._attachments.remove(attachment);
            let ex = attachment.getRemovalCallback();
            if (ex != null)
                ex.attachmentRemoved(attachment);
            this.recalculatePermissions();
        }
    }

    recalculatePermissions() {
        this.clearPermissions();
        let server = minejs.Server.getInstance();
        let defaults = server.getPluginManager().getDefaultPermissions(this.isOp());
        server.getPluginManager().subscribeToDefaultPerms(this.isOp(), this._parent != null ? this._parent : this);

        for (let key in defaults) {
            let perm = defaults[key];
            let name = perm.getName();
            this.permissions.put(name, new minejs.permission.PermissionAttachmentInfo(this._parent != null ? this._parent : this, name, null, true));
            server.getPluginManager().subscribeToPermission(name, this._parent != null ? this._parent : this);
            this.calculateChildPermissions(perm.getChildren(), false, null);
        }

        for (let attachment in this.attachments)
            this.calculateChildPermissions(attachment.getPermissions(), false, attachment);
    }

    clearPermissions() {
        let server = minejs.Server.getInstance();
        for (let name in this._permissions)
            server.getPluginManager().unsubscribeFromPermission(name, this._parent != null ? this._parent : this);

        server.getPluginManager().unsubscribeFromDefaultPerms(false, this._parent != null ? this._parent : this);
        server.getPluginManager().unsubscribeFromDefaultPerms(true, this._parent != null ? this._parent : this);

        this._permissions.clear();
    }

    /**
     * @param {object} children
     * @param {boolean} invert
     * @param {minejs.permission.PermissionAttachment} attachment
     */
    calculateChildPermissions(children, invert, attachment) {
            for (let key in children) {
                let perm = minejs.Server.getInstance().getPluginManager().getPermission(key);
                let value = (children[key] ^ invert);
                this.permissions.put(key, new minejs.permission.PermissionAttachmentInfo(this._parent != null ? this._parent : this, key, attachment, value));
                minejs.Server.getInstance().getPluginManager().subscribeToPermission(key, this._parent != null ? this._parent : this);

                if (perm != null)
                    this.calculateChildPermissions(perm.getChildren(), !value, attachment);
            }
        }
        /**
         * @return {object}
         */
    getEffectivePermissions() {
        return this._permissions;
    }
}