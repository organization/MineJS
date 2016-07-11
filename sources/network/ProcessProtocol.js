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
        };
    }
}