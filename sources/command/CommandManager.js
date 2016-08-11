/* global minejs */
var __commandManagerInstance = null;
class CommandManager {
    constructor() {
        this.__commandMap = {};
        this.__commandType = {};
        this.__commandSettings = {};
    }

    static getInstance() {
        if (!__commandManagerInstance)
            __commandManagerInstance = new this();
        return __commandManagerInstance;
    }

    registerCommand(settings, process) {
        this.registerCommand(settings, process, false);
    }

    registerCommand(settings, process, type) {
        let commandName = this.__slashRemove(settings.name);
        commandName = commandName.toLowerCase();

        this.__commandMap[commandName] = process;
        this.__commandType[commandName] = type;
        this.__commandSettings[commandName] = settings;
    }

    /** 한번만 실행되어야하는 명령어인지 확인합니다. **/
    checkIsOnceRun(commandName) {
        commandName = this.__slashRemove(commandName);
        return (this.__commandType[commandName] == null) ? true : this.__commandType[commandName];
    }

    process(commandName, args) {
        var lang = minejs.Server.getServer().getLang();
        commandName = this.__slashRemove(commandName);
        commandName = commandName.toLowerCase();

        /** 등록된 명령어라면 실행하고 아니면 /help 명령어 사용을 유도합니다. **/
        if (this.__commandMap[commandName] != null && typeof(this.__commandMap[commandName].process) == 'function') {
            this.__commandMap[commandName].process(args);
        }
        else {
            minejs.Server.getServer().getLogger().notice(lang.unknown_command, true);
        }
    }

    /** /가 명령어 앞에 포함된 경우 /만 잘라냅니다. **/
    __slashRemove(commandName) {
        commandName = String(commandName);
        if (commandName[0] == '/') commandName = commandName.substring(1);
        return commandName;
    }

    getCommandsDetail() {
        return this.__commandSettings;
    }
}

minejs.command.CommandManager = CommandManager;
