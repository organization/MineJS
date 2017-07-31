/* global minejs */

class PluginLogger {
    constructor(pluginContext) {
        let prefix = pluginContext.getDescription().getPrefix();
        this.pluginName = prefix !== null ? '[' + prefix + '] ' : '[' + pluginContext.getDescription().getName() + '] ';
    }
    
    emergency(message) {
        this.log(minejs.utils.LogLevel.EMERGENCY, message);
    }
    
    alert(message) {
        this.log(minejs.utils.LogLevel.ALERT, message);
    }
    
    critical(message) {
        this.log(minejs.utils.LogLevel.CRITICAL, message);
    }
    
    error(message) {
        this.log(minejs.utils.LogLevel.ERROR, message);
    }
    
    warning(message) {
        this.log(minejs.utils.LogLevel.WARNING, message);
    }
    
    notice(message) {
        this.log(minejs.utils.LogLevel.NOTICE, message);
    }
    
    info(message) {
        this.log(minejs.utils.LogLevel.INFO, message);
    }
    
    debug(message) {
        this.log(minejs.utils.LogLevel.DEBUG, message);
    }
    
    log(level, message) {
        minejs.Server.getInstance().getLogger().log(level, this.pluginName + message, null, false);
    }
}

minejs.plugin.PluginLogger = PluginLogger;