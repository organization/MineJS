'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        var serverInstance = null;
        minejs.Server = class Server{
            constructor(path, settings){
                if(!serverInstance) {
                    serverInstance = this;
                    this._init(path, settings);
                }
                return serverInstance;
            }
            static getServer(){
                if(!serverInstance)
                    new this();
                return serverInstance;
            }
            
            getName(){
                return "MineJS";
            }
            getCodeName(){
                return minejs.CODENAME;
            }
            getMineJSVersion(){
                return minejs.VERSION;
            }
            getMinecraftVersion(){
                return minejs.MINECRAFT_VERSION;
            }
            getDatapath(){
                return this._datapath;
            }
            getPluginPath(){
                return minejs.PLUGIN_PATH;
            }
            getMaxPlayers(){
                return this.getSettings().properties.max_players;
            }
            getPort(){
                return this.getSettings().properties.server_port;
            }
            getViewDistance(){
                return this.getSettings().properties.view_distance;
            }
            getIp(){
                return this.getSettings().properties.server_ip;
            }
            getServerUniqueId(){
                return this.getSettings().server_uuid;
            }
            
            getOs(){
                return require('os');
            }
            getFs(){
                return require('fs');
            }
            getPath(){
                return require('path');
            }
            getCluster(){
                return require('cluster');
            }
            getUtil(){
                return require('util');
            }
            getLogger() {
                return this.logger;
            }
            getCommandManager() {
                return this._commandManager;
            }
            getDatabase(){
                return minejs.database.Datastore.getInstance();
            }
            getSettings(){
                return this._settings;
            }
            getLang(){
                return this._lang;
            }
            
            _init(path, settings) {
                this._datapath = path;
                this._settings = settings;
                this._lang = require(this._datapath + '/lang.json');
                var lang = this._lang;
                this.logger = new minejs.utils.MainLogger(null, this._datapath, false);
                
                /** 마스터 서버의 처리를 구현합니다. **/
                if(this.getCluster().isMaster){
                    this.getLogger().tag = "MASTER";
                    this.getLogger().notice(lang.minejs_has_activated + process.pid);
                    
                    /** 외부아이피를 얻어와서 출력해줍니다. **/
                    var getIp = require('external-ip')();
                    getIp(function(err, ip){
                        if(err){
                            minejs.Server.getServer().getLogger().notice(lang.IP_Address + "undefined");
                        }else{
                            minejs.Server.getServer().getLogger().notice(lang.IP_Address + ip);
                        }
                    });
                    
                    /** 워커의 프로세스 아이디 명단이 여기에 저장됩니다. **/
                    var workerPids = {};
                    
                    /** 순환적으로 명령어를 실행할 워커번호를 기록합니다. **/
                    var workerIndex = 1;
                    
                    /** CPU 수 만큼 워커를 생성합니다. **/
                    for (var i = 0; i < this.getOs().cpus().length; i++) {
                        this.getCluster().fork();
                    }
                    
                    /** Embedded Memcached Database initialize **/
                    this.getDatabase().setup();
                    
                    /** 워커로부터 전달받은 메시지를 처리합니다. **/
                    let workerProcess = (message)=>{
                        let cluster = minejs.Server.getServer().getCluster();
                        let logger = minejs.Server.getServer().getLogger();
                        switch (message[0]) {
                            
                            /** 출력해야할 메시지를 MASTER로 보내서
                            MASTER에서 출력시키도록 합니다.**/
                            case minejs.network.ProcessProtocol.LOG:
                                let level = message[1];
                                let logMessage = message[2]; 
                                let pid = message[3];
                                
                                this.getLogger().tag = pid;
                                logger.log(level, logMessage);
                                this.getLogger().tag = "MASTER";
                                break;
                                
                            /** 임의의 인스턴스에서 한번만 실행되야하는
                            명령어인지 확인 후 명령어를 실행합니다. **/
                            case minejs.network.ProcessProtocol.COMMAND_CHECK:
                                let isOnceRun = Boolean(message[1]);
                                let input = message[2];
                                
                                logger.logStream.write('/' + input);
                                logger.logStream.write('\r\n');
                                if (isOnceRun) {
                                    if(workerIndex > this.getOs().cpus().length) workerIndex = 1;
                                    cluster.workers[workerIndex++].send([minejs.network.ProcessProtocol.COMMAND, input]);
                                } else {
                                    for (let wid in cluster.workers)
                                        cluster.workers[wid].send([minejs.network.ProcessProtocol.COMMAND, input]);
                                }
                                break;
                                
                            /** 서버종료 명령이 실행되면 각 인스턴스에
                            인스턴스 종료 신호를 전달합니다.**/
                            case minejs.network.ProcessProtocol.SHUTDOWN:
                                for (let wid in cluster.workers)
                                    cluster.workers[wid].send([minejs.network.ProcessProtocol.SHUTDOWN]);
                                break;
                                
                            case minejs.network.ProcessProtocol.START_CHECK:
                                let startCheckWorkerPid = message[1];
                                workerPids[startCheckWorkerPid] = true;
                                break;
                                
                            /** 인스턴스가 서버종료를 실행한 후 마지막
                            인스턴스가 종료되면 마스터 서버도 종료합니다. **/
                            case minejs.network.ProcessProtocol.SHUTDOWN_CHECK:
                                let ShutdownCheckWorkerPid = message[1];
                                delete workerPids[ShutdownCheckWorkerPid];
                                
                                let count = 0;
                                for(let workerPidCheckOnly in workerPids)count++;
                                if(count == 0){
                                    logger.notice(lang.minejs_has_deactivated);
                                    process.exit(0);
                                }
                                break;
                                
                            /** UDP 패킷을 인스턴스로부터
                             * 받아서 클라이언트로 전송합니다. **/
                            case minejs.network.ProcessProtocol.UDP_WRITE:
                                let buffer = message[1];
                                let address = message[2];
                                let port = message[3];
                                
                                this.udpSocket.send(buffer, port, address, (err) => {
                                    this.getLogger.debug(err);
                                });
                                break;
                        }
                    };
                    /** 워커로부터 전달받은 메시지를 처리합니다. **/
                    
                    /** 워커가 켜지고 꺼질때 워커에게 알려줍니다. **/
                    /** 워커의 메시지를 받아 처리할 마스터의 처리함수를 전달합니다. **/
                    this.getCluster().on('online', function (worker) {
                        worker.send([minejs.network.ProcessProtocol.START]);
                        worker.on('message', workerProcess);
                    });
                    
                    /** 콘솔 입력을 구현합니다. **/
                    /** 콘솔 입력은 마스터에서만 구현됩니다. **/
                    var readline = require('readline');
                    var line = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    
                    /** 마스터 서버가 명령어를 입력받아서
                    필요시 모든 워커로 명령어를 전송합니다. **/
                    line.on('line', function (input) {
                        for (var wid in minejs.Server.getServer().getCluster().workers) {
                            minejs.Server.getServer().getCluster().workers[wid].send([minejs.network.ProcessProtocol.COMMAND_CHECK, input]);
                            break;
                        }
                    });
                    
                    /** UDP 소켓을 생성합니다. **/
                    this.udpSocket = require('dgram').createSocket('udp4');
                    
                    /** UDP 소켓에서 에러가 발생시 디버깅 메시지를 발생시킵니다. **/
                    this.udpSocket.on('error', (err) => {
                      minejs.Server.getServer().getLogger().debug(err.stack);
                      this.udpSocket.close();
                    });
                    
                    /** UDP 메시지를 전달 받으면 인스턴스로 전달합니다. **/
                    this.udpSocket.on('message', (msg, rinfo) => {
                        if(msg == null || rinfo.address == null || rinfo.port == null) return;
                        if(workerIndex > this.getOs().cpus().length) workerIndex = 1;
                        this.getCluster().workers[workerIndex++].send([minejs.network.ProcessProtocol.UDP, msg, rinfo.address, rinfo.port]);
                    });
                    
                    /** UDP 포트를 엽니다. **/
                    this.udpSocket.bind({
                        address: settings.properties.server_ip,
                        port: settings.properties.server_port
                    });
                }
                /** 마스터 서버 처리 구현 끝. **/
                
                /** 워커 서버의 처리를 구현합니다. **/
                if(this.getCluster().isWorker){
                    /** 마스터로부터 전달받은 메시지를 처리합니다. **/
                    process.on('message', function (message) {
                        switch (message[0]) {
                            
                            /** 서버가 활성화될 때 해당 코드를 실행합니다. **/
                            case minejs.network.ProcessProtocol.START:
                                for (let key in minejs.modules)
                                    if (typeof(minejs.modules[key].onEnable) === 'function') minejs.modules[key].onEnable();
                                minejs.Server.getServer().getLogger().notice(lang.instance_is_started);
                                process.send([minejs.network.ProcessProtocol.START_CHECK, process.pid]);
                                break;
                                
                            /** 서버가 비활성화될 때 해당 코드를 실행합니다. **/
                            case minejs.network.ProcessProtocol.SHUTDOWN:
                                for (let key in minejs.modules)
                                    if (typeof(minejs.modules[key].onDisable) === 'function') minejs.modules[key].onDisable();
                                minejs.Server.getServer().getLogger().notice(lang.instance_deactivated);
                                process.send([minejs.network.ProcessProtocol.SHUTDOWN_CHECK, process.pid]);
                                process.exit(0);
                                break;
                                
                            /** 명령어 관리자에 해당 코드를 전달합니다. **/
                            case minejs.network.ProcessProtocol.COMMAND:
                                var args = message[1].split(' ');
                                minejs.command.CommandManager.getInstance().process(args.splice(0, 1), args);
                                break;
                                
                            /** 한번만 실행되어야하는 명령어인지 여부를 마스터에 전달합니다. **/
                            case minejs.network.ProcessProtocol.COMMAND_CHECK:
                                var args = message[1].split(' ');
                                process.send([minejs.network.ProcessProtocol.COMMAND_CHECK, minejs.command.CommandManager.getInstance().checkIsOnceRun(args.splice(0, 1)), message[1]]);
                                break;
                                
                            /** UDP 패킷을 클라이언트로부터
                             * 받아서 인스턴스로 전송합니다. **/
                            case minejs.network.ProcessProtocol.UDP:
                                let packet = message[1];
                                let address = message[2];
                                let port = message[3];
                                minejs.raknet.server.UDPServerSocket.getInstance().receivePacket(packet, address, port);
                                break;
                        }
                    });
                }
                /** 워커 서버 처리 구현 끝. **/
            }
        };
    },
    onDisable: ()=>{
        //let server = minejs.Server.getServer();
        //
    }
};