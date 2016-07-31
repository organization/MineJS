/* global minejs */

var baseLangInstance = null;
class BaseLang {
    constructor() {
        if (baseLangInstance != null)
            return baseLangInstance;

        /** 유저에게 저장된 파일이 업데이트 되었는지 확인합니다. **/
        if (minejs.Server.getServer().getCluster().isMaster)
            this.updateResourceJson();

        baseLangInstance = this;
    }

    static getInstance() {
        if (!baseLangInstance)
            new this();
        return baseLangInstance;
    }

    updateResourceJson() {
        let languagePrefix = minejs.Server.getServer().getSettings().settings.language;

        let resourcePath = minejs.Server.getServer().getDatapath() + "/resources/lang/" + languagePrefix + "/";
        let resourceLang = require(resourcePath + "lang.json");
        let resourceSettings = require(resourcePath + "settings.json");

        let serverPath = minejs.Server.getServer().getDatapath() + "/";
        let currentLang = require(serverPath + "lang.json");
        let currentSettings = require(serverPath + "settings.json");

        let fs = minejs.Server.getServer().getFs();

        /** 언어파일을 업데이트 합니다. **/
        if (resourceLang.version > currentLang.version)
            fs.writeFileSync(resourcePath + "lang.json", JSON.stringify(resourceLang, null, 4), 'utf8');

        let settingsReplace = (key, replaceKey) => {
            if (replaceKey == null) replaceKey = key;
            eval("resourceSettings." + replaceKey + " = currentSettings." + key + ";");
        }

        /** 설정파일을 업데이트 합니다. **/
        if (resourceSettings.version > currentSettings.version) {
            //SETTINGS UPDATE
            settingsReplace("server_uuid");
            settingsReplace("properties.motd");
            settingsReplace("properties.server_port");
            settingsReplace("properties.server_ip");
            settingsReplace("properties.view_distance");
            settingsReplace("properties.white_list");
            settingsReplace("properties.announce_player_achievements");
            settingsReplace("properties.spawn_protection");
            settingsReplace("properties.max_players");
            settingsReplace("properties.allow_flight");
            settingsReplace("properties.spawn_animals");
            settingsReplace("properties.spawn_mobs");
            settingsReplace("properties.gamemode");
            settingsReplace("properties.force_gamemode");
            settingsReplace("properties.hardcore");
            settingsReplace("properties.pvp");
            settingsReplace("properties.difficulty");
            settingsReplace("properties.generator_settings");
            settingsReplace("properties.level_name");
            settingsReplace("properties.level_seed");
            settingsReplace("properties.level_type");
            settingsReplace("properties.enable_query");
            settingsReplace("settings.language");
            settingsReplace("settings.force_language");
            settingsReplace("settings.shutdown_message");
            settingsReplace("settings.query_plugins");
            settingsReplace("settings.deprecated_verbose");
            settingsReplace("settings.cluster_workers");
            settingsReplace("network.batch_threshold");
            settingsReplace("network.compression_level");
            settingsReplace("debug.level");
            settingsReplace("level_settings.default_format");
            settingsReplace("level_settings.auto_tick_rate");
            settingsReplace("level_settings.auto_tick_rate_limit");
            settingsReplace("level_settings.base_tick_rate");
            settingsReplace("level_settings.always_tick_players");
            settingsReplace("chunk_sending.per_tick");
            settingsReplace("chunk_sending.max_chunks");
            settingsReplace("chunk_sending.spawn_threshold");
            settingsReplace("chunk_sending.cache_chunks");
            settingsReplace("chunk_ticking.per_tick");
            settingsReplace("chunk_ticking.tick_radius");
            settingsReplace("chunk_ticking.light_updates");
            settingsReplace("chunk_ticking.clear_tick_list");
            settingsReplace("chunk_generation.queue_size");
            settingsReplace("chunk_generation.population_queue_size");
            settingsReplace("ticks_per.animal_spawns");
            settingsReplace("ticks_per.monster_spawns");
            settingsReplace("ticks_per.autosave");
            settingsReplace("ticks_per.cache_cleanup");
            settingsReplace("spawn_limits.monsters");
            settingsReplace("spawn_limits.animals");
            settingsReplace("spawn_limits.water_animals");
            settingsReplace("spawn_limits.ambient");

            for (let key in currentSettings.aliases)
                resourceSettings.aliases[key] = currentSettings.aliases[key];

            for (let key in currentSettings.worlds)
                resourceSettings.worlds[key] = currentSettings.worlds[key];

            fs.writeFileSync(serverPath + "settings.json", JSON.stringify(resourceSettings, null, 4), 'utf8');
        }
    }
}