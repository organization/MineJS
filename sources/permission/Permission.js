/* global minejs */
class Permission {
    static get DEFAULT_OP() {
        return "op";
    }
    static get DEFAULT_NOT_OP() {
        return "notop";
    }
    static get DEFAULT_TRUE() {
        return "true";
    }
    static get DEFAULT_FALSE() {
        return "false";
    }

    static get DEFAULT_PERMISSION() {
        return Permission.DEFAULT_PERMISSION;
    }

    /**
     * @param {string} value
     * @return {string}
     */
    static getByName(value) {
        value = String(value);
        switch (value.toLowerCase()) {
            case "op":
            case "isop":
            case "operator":
            case "isoperator":
            case "admin":
            case "isadmin":
                return Permission.DEFAULT_OP;

            case "!op":
            case "notop":
            case "!operator":
            case "notoperator":
            case "!admin":
            case "notadmin":
                return Permission.DEFAULT_NOT_OP;

            case "true":
                return Permission.DEFAULT_TRUE;

            default:
                return Permission.DEFAULT_FALSE;
        }
    }

    /**
     * @param {string} name
     * @param {string} description
     * @param {string} defaultValue
     * @param {object} children
     */
    constructor(name, description, defualtValue, children) {
        this._name = name != null ? name : "";
        this._description = description != null ? description : "";
        this._defaultValue = defualtValue != null ? defualtValue : Permission.DEFAULT_PERMISSION;
        this._children = children != null ? children : {};

        this.recalculatePermissibles();
    }

    getName() {
        return this._name;
    }
    getChildren() {
        return this._children;
    }
    getDefault() {
        return this._defaultValue;
    }

    /**
     * @param {string} value
     */
    setDefault(value) {
        if (value != this._defaultValue) {
            this._defaultValue = value;
            this.recalculatePermissibles();
        }
    }

    /**
     * @return {string}
     */
    getDescription() {
        return this._description;
    }

    /**
     * @param {string} description
     */
    setDescription(description) {
        this._description = description;
    }

    /**
     * @return minejs.permission.Permissible
     */
    getPermissibles() {
        return minejs.Server.getInstance().getPluginManager().getPermissionSubscriptions(this.name);
    }

    recalculatePermissibles() {
        let perms = this.getPermissibles();
        minejs.Server.getInstance().getPluginManager().recalculatePermissionDefaults(this);

        for (let p in perms) p.recalculatePermissions();
    }

    /**
     * @param {Permission || String} permission
     * @param {boolean} value
     * @return {Permission || null}
     */
    addParent(permission, value) {
        if (permission instanceof Permission) {
            this.getChildren().put(this.getName(), value);
            permission.recalculatePermissibles();
            return null;
        }
        else {
            let perm = minejs.Server.getInstance().getPluginManager().getPermission(String(permission));
            if (perm == null) {
                perm = new Permission(permission);
                minejs.Server.getInstance().getPluginManager().addPermission(perm);
            }
            this.addParent(perm, value);
            return perm;
        }
    }

    /**
     * @param {object} data
     * @param {string} defaultValue
     * @return Array
     */
    loadPermissions(data, defaultValue) {
        if (defaultValue == null) defaultValue = Permission.DEFAULT_OP;
        let result = [];
        if (data != null) {
            for (let key in data) {
                let entry = data[key];
                result.add(this.loadPermission(key, entry, defaultValue, result));
            }
        }
        return result;
    }

    loadPermission(name, data, defaultValue, output) {
        if (defaultValue == null) defaultValue = Permission.DEFAULT_OP;
        if (output == null) output = [];

        let desc = null;
        let children = {};
        if (data.containsKey("default")) {
            let value = Permission.getByName(String.valueOf(data.get("default")));
            if (value != null) {
                defaultValue = value;
            }
        }

        if (data.containsKey("children")) {
            for (let key in data.get("children")) {
                let permission = this.loadPermission(key, data.get("children")[key], defaultValue, output);
                if (permission != null) output.add(permission);
                children.put(key, true);
            }
        }

        if (data.containsKey("description")) desc = String(data.get("description"));
        return new Permission(name, desc, defaultValue, children);
    }
}