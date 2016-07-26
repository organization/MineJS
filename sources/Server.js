'use strict';

/* global minejs */
module.exports = {
    /**
     * @description
     * This function is called when the module is loaded.
     * 모듈이 로딩될 때 이 함수가 호출됩니다.
     */
    onLoad: ()=>{
        /**
         * @description
         * Server class singleton instance is stored in this variable.
         * 서버 클래스의 싱글톤 인스턴스가 이 변수에 저장됩니다.
         */
        var serverInstance = null;
        /**
         * @description
         * MineJS of server class.
         * MineJS의 서버 클래스입니다.
         */
        minejs.Server = class Server{
            /**
             * @description
             * Singleton class constructor.
             * 싱글톤 클래스 생성자입니다.
             * @param {string} path
             * @param {array} settings
             * @param {function} restart
             */
            constructor(path, settings, restart){
                if(!serverInstance) {
                    serverInstance = this;
                    this._init(path, settings, restart);
                }
                return serverInstance;
            }

            /**
             * @description
             * It returns the singleton instance of the server class.
             * 서버클래스의 싱글톤 인스턴스를 반환합니다.
             */
            static getServer(){
                if(!serverInstance)
                    new this();
                return serverInstance;
            }

            /**
             * @description
             * It returns the name of the server.
             * 서버의 이름을 반환합니다.
             * @return {string}
             */
            getName(){
                return "MineJS";
            }

            /**
             * @description
             * It returns the code name of the server.
             * 서버의 코드명을 반환합니다.
             * @return {string}
             */
            getCodeName(){
                return minejs.CODENAME;
            }

            /**
             * @description
             * It returns the version name of the server.
             * 서버의 버전명을 반환합니다.
             * @return {string}
             */
            getMineJSVersion(){
                return minejs.VERSION;
            }

            /**
             * @description
             * It returns the latest version of Minecraft name supported by the server.
             * 서버가 지원하는 최신 마인크래프트 버전명을 반환합니다.
             * @return {string}
             */
            getMinecraftVersion(){
                return minejs.MINECRAFT_VERSION;
            }

            /**
            * @description
            * It returns the address of the server folder.
            * 서버가 구동중인 폴더 주소를 반환합니다.
            * @return {string}
            */
            getDatapath(){
                return this._datapath;
            }

            /**
            * @description
            * It returns the address to find the plug-ins folder.
            * 서버가 플러그인을 찾는 폴더 주소를 반환합니다.
            * @return {string}
            */
            getPluginPath(){
                return minejs.PLUGIN_PATH;
            }

            /**
            * @description
            * It returns the maximum number of people can be connected to the server.
            * 서버에 접속 가능한 최대 인원 수를 반환합니다.
            * @return {integer}
            */
            getMaxPlayers(){
                return this.getSettings().properties.max_players;
            }

            /**
            * @description
            *
            * 서버가 열리는 포트번호를 반환합니다.
            * @return {integer}
            */
            getPort(){
                return this.getSettings().properties.server_port;
            }

            /**
            * @description
            * It returns the number of distance limit from which the user can view up to the In-game.
            * 서버에서 유저가 최대로 볼 수 있는 거리제한 수를 반환합니다.
            * @return {integer}
            */
            getViewDistance(){
                return this.getSettings().properties.view_distance;
            }

            /**
            * @description
            * It return server IP of settings.json.
            * 설정된 서버 아이피를 반환합니다.
            * @return {string}
            */
            getIp(){
                return this.getSettings().properties.server_ip;
            }

            /**
            * @description
            * It returns the UUID of the server.
            * 서버의 UUID를 반환합니다.
            * @return {string}
            */
            getServerUniqueId(){
                return this.getSettings().server_uuid;
            }

            /**
            * @description
            * It returns the OS module.
            * OS 모듈을 반환합니다.
            * @return {string}
            */
            getOs(){
                return require('os');
            }

            /**
            * @description
            * It returns the File System module.
            * 파일시스템 모듈을 반환합니다.
            * @return {object}
            */
            getFs(){
                return require('fs');
            }

            /**
            * @description
            * It returns the Path module.
            * Path 모듈을 반환합니다.
            * @return {object}
            */
            getPath(){
                return require('path');
            }

            /**
            * @description
            * It returns the Cluster module.
            * 클러스터 모듈을 반환합니다.
            * @return {object}
            */
            getCluster(){
                return require('cluster');
            }

            /**
            * @description
            * It returns the worker to using index. (1 ~ CPU Cores)
            * 1~CPU코어수 중의 숫자를 입력받아 해당되는 순서의 워커를 반환합니다.
            * @param {integer} index
            * @return {object}
            */
            getWorker(index){
                let count = 0;
                let workers = {};
                for(let key in this.getCluster().workers)
                    workers[count++] = this.getCluster().workers[key];

                let target = workers[index];
                if(target == null){
                    for(let key in this.getCluster().workers){
                        target = this.getCluster().workers[key];
                        break;
                    }
                }
                return target;
            }

            /**
            * @description
            * It returns Util module.
            * Util 모듈을 반환합니다.
            * @return {object}
            */
            getUtil(){
                return require('util');
            }

            /**
            * @description
            * It returns singleton instance of Server MainLogger.
            * 서버 메인로거를 반환합니다.
            * @return {object}
            */
            getLogger() {
                return this.logger;
            }

            /**
            * @description
            * It returns the singleton instance of the Command Manager.
            * 명령어 관리자의 싱글톤 인스턴스를 반환합니다.
            * @return {object}
            */
            getCommandManager() {
                return this._commandManager;
            }

            /**
            * @description
            * It returns the singleton instance of the Cluster Datastore.
            * 클러스터 데이터스토어의 싱글톤 인스턴스를 반환합니다.
            * @return {object}
            */
            getDatabase(){
                return minejs.database.Datastore.getInstance();
            }

            /**
            * @description
            * It returns settings.json data.
            * settings.json 의 자료를 반환합니다.
            * @return {object}
            */
            getSettings(){
                return this._settings;
            }

            /**
            * @description
            * It returns lang.json data.
            * lang.json 의 자료를 반환합니다.
            * @return {object}
            */
            getLang(){
                return this._lang;
            }

            /**
             * @description
             * Run the function. By specifying the randomly Worker.
             * 무작위로 워커를 지정해서 함수를 실행시킵니다.
             * @param {function} func
             */
            randomExecute(func){
                let server = minejs.Server.getServer();
                let pid = minejs.network.ProcessProtocol.WORKER_WORK_PUSH;

                func = func.toString();
                if(server.getCluster().isMaster){
                    let randomIndex = Math.floor(Math.random() * (server.getOs().cpus().length - 1));
                    minejs.Server.getServer().getWorker(randomIndex).send([pid, func]);
                }else{
                    process.send([pid, func]);
                }
            }

            /**
             * @description
             * Run the function from the master.
             * It can receive a function from Worker.
             * 워커에서 함수를 받아서 마스터에서 실행시킵니다.
             * @param {function} func
             **/
            masterExecute(func){
                if(minejs.Server.getServer().getCluster().isMaster){
                    func();
                }else{
                    func = func.toString();
                    process.send([minejs.network.ProcessProtocol.MASTER_WORK_PUSH, func]);
                }
            }

            /**
            * @description
            * The function that initializes the server.
            * 서버를 초기화하는 함수입니다.
            */
            _init(path, settings, restart) {
                this._datapath = path;
                this._settings = settings;
                this._restart = restart;
                this.restartFlag = false;

                this._lang = require(this._datapath + '/lang.json');
                var lang = this._lang;
                this.logger = new minejs.utils.MainLogger(null, this._datapath, false);

                /**
                * @description
                * The process of implementing the master server.
                * 마스터 서버의 처리를 구현합니다.
                */
                if(this.getCluster().isMaster){
                    this.getLogger().tag = "MASTER";
                    this.getLogger().notice(lang.minejs_has_activated + process.pid);

                    /**
                    * @description
                    * Prints external IP to get the Internet.
                    * 외부아이피를 얻어와서 출력해줍니다.
                    */
                    var getIp = require('external-ip')();
                    getIp(function(err, ip){
                        if(err){
                            minejs.Server.getServer().getLogger().notice(lang.IP_Address + "undefined", true);
                        }else{
                            minejs.Server.getServer().getLogger().notice(lang.IP_Address + ip, true);
                        }
                    });

                    /**
                    * @description
                    * The process ID List of Worker is stored in here.
                    * 워커의 프로세스 아이디 명단이 여기에 저장됩니다.
                    */
                    var workerPids = {};

                    /**
                    * @description
                    * Save the index of worker, will be using runs a command recursively.
                    * 순환적으로 명령어를 실행할 워커번호를 기록합니다.
                    */
                    var workerIndex = 1;

                    /**
                    * @description
                    * It creates a worker as the number of CPU cores.
                    * CPU 수 만큼 워커를 생성합니다.
                    */
                    for (var i = 0; i < this.getOs().cpus().length; i++)
                        this.getCluster().fork();

                    /**
                    * @description
                    * Embedded Memcached Database initialize
                    * 내장된 멤케시드 데이터베이스를 초기화 합니다.
                    * @return {string}
                    */
                    this.getDatabase().setup();

                    /**
                    * @description
                    * Save the worker counts of normally started.
                    * 정상적으로 켜진 워커수를 기록합니다.
                    * @return {string}
                    */
                    var onlineWorkerCount = 0;

                    /**
                    * @description
                    * It processes messages received from worker.
                    * 워커로부터 전달받은 메시지를 처리합니다.
                    */
                    let workerProcess = (message)=>{
                        let cluster = minejs.Server.getServer().getCluster();
                        let logger = minejs.Server.getServer().getLogger();
                        switch (message[0]) {
                            /**
                            * @description
                            *Send a log message to the master and log in the MASTER.
                            * In order to avoid overlap logs.
                            * 중첩된 메시지 출력을 방지하기 위해서
                            * 메시지를 MASTER로 보내서 MASTER에서 출력시키도록 합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.LOG:
                                let level = message[1];
                                let logMessage = message[2];
                                let pid = message[3];
                                let needDuplicate = message[4];
                                logger.log(level, logMessage, pid, needDuplicate);
                                break;

                            /**
                            * @description
                            * Run the command. after confirming that the
                            * command is should be executed only once in any instance.
                            * 임의의 인스턴스에서 한번만 실행되야하는
                            * 명령어인지 확인 후 명령어를 실행합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.COMMAND_CHECK:
                                let isOnceRun = Boolean(message[1]);
                                let input = message[2];

                                logger.logStream.write('/' + input);
                                logger.logStream.write('\r\n');
                                if (isOnceRun) {
                                    if(workerIndex > this.getOs().cpus().length) workerIndex = 1;
                                    minejs.Server.getServer().getWorker(workerIndex++).send([minejs.network.ProcessProtocol.COMMAND, input]);
                                } else {
                                    for (let wid in cluster.workers)
                                        cluster.workers[wid].send([minejs.network.ProcessProtocol.COMMAND, input]);
                                }
                                break;

                            /**
                            * @description
                            * If the server is shut down command is executed,
                            * it sends the termination signal to every each instance.
                            * 서버종료 명령이 실행되면 각 인스턴스에
                            * 인스턴스 종료 신호를 전달합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.SHUTDOWN:
                                for (let wid in cluster.workers){
                                    cluster.workers[wid].send([minejs.network.ProcessProtocol.SHUTDOWN]);
                                    cluster.workers[wid].disconnect();
                                }
                                break;

                            /**
                            * @description
                            * Collect PIDs when the worker turns on has been sent their pid,
                            * and check sure that all servers are turned on.
                            * 워커가 켜질때 전달해온 PID를 수집하고, 모든 서버가 켜졌는지 확인합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.START_CHECK:
                                let startCheckWorkerPid = message[1];
                                workerPids[startCheckWorkerPid] = true;

                                if(++onlineWorkerCount == this.getOs().cpus().length){
                                    logger.notice(lang.instance_all_activated.replace('%count%', this.getOs().cpus().length));

                                    /**
                                    * @description
                                    * Send PID List to the worker.
                                    * PIDS 목록을 워커에 전송합니다.
                                    * @return {string}
                                    */
                                    let pidList = [];
                                    for(let pid in workerPids) pidList.push(pid);

                                    minejs.loader.putPids(pidList);

                                    for (let wid in cluster.workers)
                                        cluster.workers[wid].send([minejs.network.ProcessProtocol.WORKER_PIDS, pidList]);
                                }
                                break;

                            /**
                            * @description
                            * Terminate the master server. when after server instance
                            * is shut down and the last instance is terminated.
                            * 인스턴스가 서버종료를 실행한 후 마지막
                            * 인스턴스가 종료되면 마스터 서버도 종료합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.SHUTDOWN_CHECK:
                                let ShutdownCheckWorkerPid = message[1];
                                delete workerPids[ShutdownCheckWorkerPid];

                                let count = 0;
                                for(let workerPidCheckOnly in workerPids)count++;
                                if(count == 0){
                                    if(this.restartFlag == true){
                                        workerPids = {};
                                        minejs.loader.pids = {};
                                        onlineWorkerCount = 0;
                                        this._restart(()=>{
                                            /**
                                            * @description
                                            * It creates a worker as the number of CPU cores.
                                            * CPU 수 만큼 워커를 생성합니다.
                                            * @return {string}
                                            */
                                            for (let i = 0; i < minejs.Server.getServer().getOs().cpus().length; i++)
                                                minejs.Server.getServer().getCluster().fork();
                                        });
                                    }else{
                                        logger.notice(lang.instance_all_deactivated.replace('%count%', this.getOs().cpus().length));
                                        logger.notice(lang.minejs_has_deactivated);

                                        /**
                                        * @description
                                        * Call the onDisable function from the master server.
                                        * 마스터 서버에서의 onDisable 작동
                                        * @return {string}
                                        */
                                        for (let key in minejs.loader.modules)
    	                                    if (typeof(minejs.loader.modules[key].onDisable) === 'function') minejs.loader.modules[key].onDisable();

                                        process.exit(0);
                                    }
                                }
                                break;

                             /**
                             * @description
                             * It receives a UDP packet from the instance and sends it to the client.
                             * UDP 패킷을 인스턴스로부터 받아서 클라이언트로 전송합니다.
                             * @return {string}
                             */
                            case minejs.network.ProcessProtocol.UDP_WRITE:
                                let buffer = message[1];
                                let address = message[2];
                                let port = message[3];

                                this.udpSocket.send(buffer, port, address, (err) => {
                                    this.getLogger.debug(err);
                                });
                                break;

                            /**
                            * @description
                            * Bring functions that need to run in Worker
                            * Transfer to instances at random.
                            * 실행시킬 함수를 워커에서 받아와서
                            * 무작위로 인스턴스에 전달시킵니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.WORKER_WORK_PUSH:
                                let func = message[1];
                                if(workerIndex > this.getOs().cpus().length) workerIndex = 1;
                                minejs.Server.getServer().getWorker(workerIndex++).send([minejs.network.ProcessProtocol.WORKER_WORK_PUSH, func]);
                                break;

                            /**
                            * @description
                            * Run the function, worker has sent function to the master.
                            * 워커가 마스터로 보내온 함수를 실행시킵니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.MASTER_WORK_PUSH:
                                try{ eval('(' + message[1] + ')')(); }catch(e){};
                                break;
                        }
                    };

                    /**
                    * @description
                    * If worker is turned on or off, to send a signal to the worker.
                    * Send the process message handle function of the master to worker.
                    * 워커가 켜지고 꺼질때 워커에게 알려줍니다.
                    * 워커의 메시지를 받아 처리할 마스터의 처리함수를 전달합니다.
                    * @return {string}
                    */
                    this.getCluster().on('online', function (worker) {
                        worker.send([minejs.network.ProcessProtocol.START]);
                        worker.on('message', workerProcess);
                    });

                    /**
                    * @description
                    * Implement a console input.
                    * Console input is implemented only on the master.
                    * 콘솔 입력을 구현합니다.
                    * 콘솔 입력은 마스터에서만 구현됩니다.
                    * @return {string}
                    */
                    var readline = require('readline');
                    this.line = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });

                    /**
                    * @description
                    * Master server receive a command input,
                    * send a command to all worker.
                    * 마스터 서버가 명령어를 입력받아서
                    * 모든 워커로 명령어를 전송합니다.
                    * @return {string}
                    */
                    this.line.on('line', function (input) {
                        for (let wid in minejs.Server.getServer().getCluster().workers) {
                            minejs.Server.getServer().getCluster().workers[wid].send([minejs.network.ProcessProtocol.COMMAND_CHECK, input]);
                            break;
                        }
                    });

                    /**
                    * @description
                    * Create UDP Socket.
                    * UDP 소켓을 생성합니다
                    * @return {string}
                    */
                    this.udpSocket = require('dgram').createSocket('udp4');

                    /**
                    * @description
                    * If an error occurs in UDP socket Throws an debugging messages.
                    * UDP 소켓에서 에러가 발생시 디버깅 메시지를 발생시킵니다.
                    * @return {string}
                    */
                    this.udpSocket.on('error', (err) => {
                      minejs.Server.getServer().getLogger().debug(err.stack);
                      this.udpSocket.close();
                    });

                    /**
                     * @description
                     * Division the session using the IP and PORT and,
                     * Session packets must will be connected to the same worker as before.
                     * IP:PORT': 'WORKER_PID'
                     * IP와 PORT를 이용해서 세션을 구분하고,
                     * 해당 세션패킷은 반드시 이전과 동일한 워커로 연결되도록 합니다.
                     * 'IP:PORT': '워커PID'
                     */
                    var sessionLoadBalance = {};

                    /**
                    * @description
                    * If the received UDP message to the client.
                    * The master sends a message to the worker instance.
                    * UDP 메시지를 전달 받으면 인스턴스로 전달합니다.
                    * @return {string}
                    */
                    this.udpSocket.on('message', (msg, rinfo) => {
                        if(msg == null || rinfo.address == null || rinfo.port == null) return;
                        let balancedWorkerIndex = 1;
                        if(!sessionLoadBalance[rinfo.address + ':' + rinfo.port]){
                            if(workerIndex > this.getOs().cpus().length) workerIndex = 1;
                            balancedWorkerIndex = workerIndex++;
                        }else{
                            balancedWorkerIndex = sessionLoadBalance[rinfo.address + ':' + rinfo.port];
                        }

                        minejs.Server.getServer().getWorker(balancedWorkerIndex).send([minejs.network.ProcessProtocol.UDP, msg, rinfo.address, rinfo.port]);
                    });

                    /**
                    * @description
                    * Open the UDP Port.
                    * UDP 포트를 엽니다.
                    * @return {string}
                    */
                    this.udpSocket.bind({
                        address: settings.properties.server_ip,
                        port: settings.properties.server_port
                    });

                    /**
                    * @description
                    * Run onEnable function in master server.
                    * 마스터 서버에서의 onEnable 작동
                    * @return {string}
                    */
                    for (let key in minejs.loader.modules)
	                    if (typeof(minejs.loader.modules[key].onEnable) === 'function') minejs.loader.modules[key].onEnable();
                }

                /**
                * @description
                * Implement the handle of worker server.
                * 워커 서버의 처리를 구현합니다.
                * @return {string}
                */
                if(this.getCluster().isWorker){
                    /**
                    * @description
                    * It processes messages received from master.
                    * 마스터로부터 전달받은 메시지를 처리합니다.
                    * @return {string}
                    */
                    process.on('message', function (message) {
                        switch (message[0]) {

                            /**
                            * @description
                            * When the server has activated run the onEnable Function.
                            * 서버가 활성화될 때 onEnable 함수를 실행합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.START:
                                for (let key in minejs.loader.modules)
                                    if (typeof(minejs.loader.modules[key].onEnable) === 'function') minejs.loader.modules[key].onEnable();

                                minejs.Server.getServer().getLogger().notice(lang.instance_is_started,
                                (minejs.Server.getServer().getOs().cpus().length <= 8) ? true: false);

                                process.send([minejs.network.ProcessProtocol.START_CHECK, process.pid]);
                                break;

                            /**
                            * @description
                            * When the server has deactivated run the onDisable Function.
                            * 서버가 비활성화될 때 onDisable 함수를 실행합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.SHUTDOWN:
                                for (let key in minejs.loader.modules)
                                    if (typeof(minejs.loader.modules[key].onDisable) === 'function') minejs.loader.modules[key].onDisable();

                                minejs.Server.getServer().getLogger().notice(lang.instance_deactivated,
                                (minejs.Server.getServer().getOs().cpus().length <= 8) ? true: false);

                                process.send([minejs.network.ProcessProtocol.SHUTDOWN_CHECK, process.pid]);
                                process.exit(0);
                                break;

                            /**
                            * @description
                            * Transfer the command to the CommandManager.
                            * 명령어 관리자에 해당 명령어를 전달합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.COMMAND:
                                var args = message[1].split(' ');
                                minejs.command.CommandManager.getInstance().process(args.splice(0, 1), args);
                                break;

                            /**
                            * @description
                            * Check command is should be executed only once.
                            * and check result send to master server.
                            * 한번만 실행되어야하는 명령어인지 여부를 마스터에 전달합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.COMMAND_CHECK:
                                var args = message[1].split(' ');
                                process.send([minejs.network.ProcessProtocol.COMMAND_CHECK, minejs.command.CommandManager.getInstance().checkIsOnceRun(args.splice(0, 1)), message[1]]);
                                break;

                             /**
                             * @description
                             * Sends UDP packets to instance When receive from the client.
                             * UDP 패킷을 클라이언트로부터 받아서 인스턴스로 전송합니다.
                             * @return {string}
                             */
                            case minejs.network.ProcessProtocol.UDP:
                                let packet = message[1];
                                let address = message[2];
                                let port = message[3];
                                minejs.raknet.server.UDPServerSocket.getInstance().receivePacket(packet, address, port);
                                break;

                            /**
                            * @description
                            * When the master sends a PIDList of workers. save this list in the loader.
                            * 마스터가 워커들의 PID목록을 보내오면 이 목록을 로더에 저장합니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.WORKER_PIDS:
                                let pidList = message[1];
                                minejs.loader.putPids(pidList);
                                break;

                            /**
                            * @description
                            * When the master sends a function to process, Run the function.
                            * 마스터가 처리할 함수를 보내오면 함수를 실행시킵니다.
                            * @return {string}
                            */
                            case minejs.network.ProcessProtocol.WORKER_WORK_PUSH:
                                try{ eval('(' + message[1] + ')')(); }catch(e){}
                                break;
                        }
                    });
                }
            }
        };
    },
    onDisable: ()=>{
        //TODO save
        //let server = minejs.Server.getServer();
    }
};
