/* global minejs */
minejs.loader.requireLoader('minejs.Server');
minejs.loader.requireLoader('minejs.command.CommandExecutor');

/**
* @description
* minejs plugin interface
* minejs 플러그인의 인터페이스 입니다.
*/
class Plugin extends minejs.command.CommandExecutor {
  /**
  * @description
  * Use to init MineJS plugin, array, database connection and variable
  * MineJS 플러그인, 배열, 데이터베이스 연결, 변수를 초기화 하기위해 사용하세요.
  */
  onLoad(){}
  /**
  * @description
  * Use to open config, Resource
  * config, Resource를 열기위해 사용하세요.
  */
  onEnable(){}
  /**
  * @description
  * Use to check if plugin is enabled.
  * 플러그인이 작동중인지 확인. 작동중(true)
  * @return {boolean}
  */
  isEnabled(){}
  /**
  * @description
  * Use to free open things and finish actions,
  * Close Resource
  * 메모리정리 및 끝내기, 자원종료애 사용합니다.
  */
  onDisable(){}
  /**
  * @description
  * Use to check if plugin is disabled
  * 플러그인이 비활성화 되었는지 확입, 비활성화(true)
  * @return {boolean}
  */
  isDisabled(){}
  /**
  * @return {string}
  */
  getDataFolder(){}
  /**
  * @return {minejs.plugin.PluginDescription}
  */
  getDescription(){}
  /**
  * @return {WriteStream}
  */
  getResource(filename){}
  /**
  * @return {boolean}
  */
  saveResource(filename){}
  /**
  * @return {boolean}
  */
  saveResource(filename, replace){}
  /**
  * @return {boolean}
  */
  saveResource(filename, outputName, replace){}
  /**
  * @return {minejs.utils.Config}
  */
  getConfig(){}
  saveConfig(){}
  saveDefaultConfig(){}
  reloadConfig(){}
  /**
  * @return {minejs.server}
  */
  getServer(){}
  /**
  * @return {string}
  */
  getName(){}
  /**
  * @return {minejs.plugin.PluginLogger}
  */
  getLogger(){}
  /**
  * @return {minejs.plugin.PluginLoader}
  */
  getPluginLoader(){}
}

minejs.plugin.Plugin = Plugin;
