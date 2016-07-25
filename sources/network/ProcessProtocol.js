'use strict';

module.exports = {
    onLoad: ()=> {
        /* global minejs */
        minejs.network.ProcessProtocol = class ProcessProtocol{
            /** 인스턴스가 시작될때 사용 **/
            static get START(){ return 0x00; }
            
            /** 인스턴스가 시작될때 사용 **/
            static get START_CHECK(){ return 0x01; }
            
            /** 인스턴스가 종료될때 사용 **/
            static get SHUTDOWN(){ return 0x02; }
            
            /** 인스턴스들이 모두 꺼진 것을 체크한 뒤
             * 마스터가 최종적으로 종료되기 위해 사용 **/
            static get SHUTDOWN_CHECK(){ return 0x03; }
            
            /** 명령어를 마스터 콘솔에서
             * 서버 인스턴스로 전송할 때 사용 **/
            static get COMMAND(){ return 0x04; }
            
            /** 명령어가 모든 인스턴스에서 실행
             * 되어야 하는 명령어인지 확인할 때 사용 **/
            static get COMMAND_CHECK(){ return 0x05; }
            
            /** 콘솔에 보이는 로그가 인스턴스간
             * 겹치지 않게 MASTER에서 관리하게 할 때 사용 **/
            static get LOG(){ return 0x06; }
            
            /** UDP 패킷을 마스터에서 받아서
            인스턴스로 보낼때 사용합니다. **/
            static get UDP(){ return 0x07; }
            
            /** UDP 패킷을 인스턴스에서 원하는
            클라이언트로 전송시 사용합니다. **/
            static get UDP_WRITE(){ return 0x08; }
            
            /** 마스터가 워커에게 현재 켜져있는
            모든 워커의 PID 목록을 보낼때 사용합니다. **/
            static get WORKER_PIDS(){ return 0x09; }
            
            /** 마스터가 특정함수를 랜덤한 인스턴스에
            전달시켜서 실행할 때 해당 PID를 사용합니다. **/
            static get WORKER_WORK_PUSH(){ return 0x10; }
            
            /** 인스턴스가 특정함수를 마스터에
            전달시켜서 실행할 때 해당 PID를 사용합니다.**/
            static get MASTER_WORK_PUSH(){ return 0x11; }
        };
    }
}