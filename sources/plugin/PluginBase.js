const fs = require('fs');
/* global minejs */
minejs.loader.requireLoader('minejs.plugin.Plugin');
minejs.loader.requireLoader('minejs.plugin.PluginLogger')

class PluginBase extends minejs.plugin.Plugin {
  constructor() {
    this._loader;
    this._server;
    this._isEnabled = false;
    this._initialized = false;
    this._description;
    this._dataFolder;
    this._config;
    this._configFile;
    this._file;
    this._logger;
  }
  onLoad(){}
  onEnable(){}
  onDisable(){}
  isEnabled(){
    return this._isEnabled;
  }

  /**
  * @description
  * Enables this plugin.
  * if you nedd to disable this plugin, you should call setEnable(false);
  * @param {boolean} bool
  */
  setEnable(bool) {
    if (this._isEnabled != bool) {
      this._isEnabled = bool;
      if (this._isEnabled) {
        onEnable();
      }else{
        onDisable();
      }
    }
  }

  setEnable(){
    this.setEnable(true);
  }

  isDisabled() {
    return !this._isEnabled;
  }

  getDataFolder() {
    return this._dataFolder;
  }

  getDescription() {
    return this._description;
  }

  init(loader, server, description, dataFolder, file) {
    if (!this._initialized) {
      this._initialized = true;
      this._loader = loader;
      this._server = server;
      this._description = description;
      this._dataFolder = dataFolder;
      this._file = file;
      this._configFile = this._dataFolder+require('path').sep+'config.yml';
      this._logger = new minejs.plugin.PluginLogger(this);
    }
  }

  getLogger() {
    return this._logger;
  }

  isInitialized() {
    return this._initialized;
  }

  getCommand(name) {
    let command = this._server.getPluginCommand(name);
    if (command == null || command.getPlugin() != this) {
      command = this._server.getPluginCommand(this._description.getName().toLowerCase() + ':' + name);
    }
    if (command != null && command.getPlugin() == this) {
      return command;
    } else {
      return null;
    }
  }

  onCommand(sender, command, label, args) {
    return false;
  }

  getResource(filename) {
    return fs.createReadStream(filename);
  }

  saveResource(filename, outputName, replace) {
    filename = this._dataFolder+require('path').sep+filename;

    if (fs.existsSync(filename)) {
      if (replace){
        this.getResource(filename).on('data', (chunk) => {
          fs.writeFile(this._dataFolder+require('path').sep+outputName, chunk,(err) => {
            if (err != null){
              return false;
            }
          });
          return true;
        });
      }
      return false;
    }
  }

  saveResource(filename, replace) {
    return saveResource(filename, filename, replace);
  }

  saveResource(filename) {
    return saveResource(filename, false);
    if (this._config == null) {
  }

  getConfig() {
      this.reloadConfig();
    }
    return this._config;
  }

  saveConfig() {
    if (!this.getConfig.save()) {
      this._logger.critical(`Couldn't save config to `+this._configFile);
    }
  }

  saveDefaultConfig() {
    if (fs.existsSync(this.getResource)) {
      this.saveResource('config.yml', false);
    }
  }

  reloadConfig() {
    this._config = new minejs.utils.Config(this._configFile);
    let configStream = this.getResource('config.yml');

    if (configStream != null) {
      //TODO Generate Dump
    }
  }

  getServer() {
    return this._server;
  }

  getName() {
    return this._description.getName();
  }

  getFullName() {
    return this._description.getFullName();
  }

  _getFile() {
    return this._file;
  }

  getPluginLoader() {
    return this._loader;
  }

}

minejs.plugin.PluginBase = PluginBase;
