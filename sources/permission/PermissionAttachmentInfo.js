class PermissionAttachmentInfo {
    /**
     * @param {minejs.permission.Permissible} permissible
     * @param {string} permission
     * @param {minejs.permission.PermissionAttachment} attachment
     * @param {boolean} value
     */
    constructor(permissible, permission, attachment, value) {
        //if (permission == null) throw new IllegalStateException("Permission may not be null");
        this._permissible = permissible;
        this._permission = permission;
        this._attachment = attachment;
        this._value = value;
    }

    /**
     * @return {minejs.permission.Permissible}
     */
    getPermissible() {
        return this._permissible;
    }

    /**
     * @return {string}
     */
    getPermission() {
        return this._permission;
    }

    /**
     * @return {minejs.permission.PermissionAttachment}
     */
    getAttachment() {
        return this._attachment;
    }

    /**
     * @return {boolean}
     */
    getValue() {
        return this._value;
    }
}

minejs.permission.PermissionAttachmentInfo = PermissionAttachmentInfo;
