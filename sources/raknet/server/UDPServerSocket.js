'use strict';

module.exports = {
    /* global minejs */
    onLoad : ()=>{
        var udpServerSocketInstance = null;
        minejs.raknet.server.UDPServerSocket = class UDPServerSocket{
            constructor(){
                if(udpServerSocketInstance != null)
                    return udpServerSocketInstance;
                udpServerSocketInstance = this;
            }
            
            /**
             * @return {minejs.raknet.server.UDPServerSocket}
             **/
            static getInstance(){
                if(!udpServerSocketInstance)
                    new this();
                return udpServerSocketInstance;
            }
            
            receivePacket(buffer, source, port){
                len = buffer.length;
                if(len > 0){
                    let pid = buffer[0];
                    
                }
                //TODO
                
            }
            
            sendPacket(buffer, source, port){
                //TODO
            }
        }
    }
}