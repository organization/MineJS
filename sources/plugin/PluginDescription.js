/* global minejs */
class PluginDescription {
  constructor(json) {
    this._name = '';
    this._version = '';
    this._api = [];
    this._commands = [];
    this._depend = [];
    this._softDepend = [];
    this._loadBefore = [];
    this._website = '';
    this._description = '';
    this._prefix = '';
    this._order = null;
    this._authors = [];
    this._permissions = [];
    this.loadJson(json);
  }

  loadJson(json) {
    this._name = json.name.replaceAll(/[^A_Za-z0-9 _.-]/, '');
    if (this._name === null) {
      //TODO: Throws error
    }
    this._name = this._name.replace(" ", "_");
    this._version = json.version;
    this._main = json.main;
    this._api = json.api;

    this._commands = json.command !== null?json.commands:null;
    this._depend = json.depend !== null?json.depend:null;
    this._softDepend = json.softdepend !== null?json.softdepend:null;
    this._loadBefore = json.loadbefore !== null?json.loadbefore:null;
    this._website = json.website !== null?json.website:null;
    this._description = json.description !== null?json.description:null;
    this._prefix = json.prefix !== null?json.prefix:null;
    this._order; //TODO: 나도 모르겠음.
    if (json.author !== null) {
      this._authors.push(json.author);
    }
    if (json.authors !== null){
      this._authors = this._authors.concat(json.authors);
    }
    this._permissions = json.permissions !== null?json.permissions:null;
  }

  getFullName() {
    return this._name + " v" + this._version;
  }

  getCompatibleAPIs() {
    return this._api;
  }

  getAuthors() {
    return this._authors;
  }

  getPrefix() {
    return this._prefix;
  }

  getCommands() {
    return this._commands;
  }

  getDepend() {
    return this._depend;
  }

  getDescription() {
    return this._description;
  }

  getLoadBefore() {
    return this._loadBefore;
  }

  getName() {
    return this._name;
  }

  getOrder() {
    return this._order;
  }

  getPermissions() {
    return this._permissions;
  }

  getSoftDepend() {
    return this._softDepend;
  }

  getVersion() {
    return this._version;
  }

  getWebsite() {
    return website;
  }

}

minejs.plugin.PluginDescription = PluginDescription;
