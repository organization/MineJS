'use strict';

/* global minejs */
module.exports = {
    /**
     * @description
     * This function is called when the module is loaded.
     * 모듈이 로딩될 때 이 함수가 호출됩니다.
     */
    onLoad: ()=> {
        /**
         * @description
         * The class that provides the PID to be used to
         * classify workers as the master inter-process
         * communication signals when the cluster is created.
         * 
         * 클러스터가 생성한 워커와 마스터 프로세스 간
         * 통신 시 신호들을 분류하기 위해서 사용하는
         * PID들을 제공하는 클래스입니다.
         */
        minejs.network.ProcessProtocol = class ProcessProtocol{
            /**
             * @desciption
             * This signal is used to start the instance.
             * 인스턴스를 시작시킬때 사용하는 신호입니다.
             */
            static get START(){ return 0x00; }
            
            /** 인스턴스가 시작될때 사용 **/
            /**
             * @desciption
             * This signal is used to notify the instance was started.
             * 인스턴스가 시작된 것을 알릴때 사용하는 신호입니다.
             */
            static get START_CHECK(){ return 0x01; }
            
            /**
             * @desciption
             * This signal is used to terminate an instance.
             * 인스턴스를 종료시킬때 사용하는 신호입니다.
             */
            static get SHUTDOWN(){ return 0x02; }
            
            /**
             * @desciption
             * This signal is used to notify the instance is terminated.
             * 인스턴스가 종료된 것을 알릴때 사용하는 신호입니다.
             */
            static get SHUTDOWN_CHECK(){ return 0x03; }
            
            /**
             * @desciption
             * This signal is used to send commands to the desired Walker.
             * 명령어를 원하는 워커에 전송할때 사용하는 신호 입니다.
             */
            static get COMMAND(){ return 0x04; }
            
            /**
             * @desciption
             * This signal is used to check the command information.
             * 명령어 정보를 확인할때 사용하는 신호입니다.
             */
            static get COMMAND_CHECK(){ return 0x05; }
            
            /**
             * @desciption
             * This signal is used when the worker is sent log to the master.
             * 로그를 워커가 마스터로 전송할때 사용하는 신호입니다.
             */
            static get LOG(){ return 0x06; }
            
            /**
             * @desciption
             * This signal is used when the master sends a UDP packet to a worker.
             * 마스터가 워커로 UDP 패킷을 전송할때 사용하는 신호입니다.
             */
            static get UDP(){ return 0x07; }
            
            /** UDP 패킷을 인스턴스에서 원하는
            클라이언트로 전송시 사용합니다. **/
            /**
             * @desciption
             * This signal is used when worker sends a UDP packet to the master.
             * 워커가 마스터로 UDP 패킷을 전송할 때 사용하는 신호입니다.
             */
            static get UDP_WRITE(){ return 0x08; }
            
            /** 마스터가 워커에게 현재 켜져있는
            모든 워커의 PID 목록을 보낼때 사용합니다. **/
            /**
             * @desciption
             * This signal is used when the master
             * is send to worker the PID list of all Worker.
             * 마스터가 워커에게 모든 워커의 PID
             * 목록을 보낼때 사용하는 신호입니다.
             */
            static get WORKER_PIDS(){ return 0x09; }
            
            /**
             * @desciption
             * This signal is used to transmit work to worker.
             * 워커에게 일을 전송할때 사용하는 신호입니다.
             */
            static get WORKER_WORK_PUSH(){ return 0x10; }
            
            /** 인스턴스가 특정함수를 마스터에
            전달시켜서 실행할 때 해당 PID를 사용합니다.**/
            /**
             * @desciption
             * This signal is used to transmit work to master.
             * 마스터에게 일을 전송할때 사용하는 신호입니다.
             */
            static get MASTER_WORK_PUSH(){ return 0x11; }
        };
    }
}