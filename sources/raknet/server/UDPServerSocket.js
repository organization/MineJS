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
            
            receivePacket(packet, address, port){
                //TODO
            }
            
            sendPacket(packet, address, port){
                //TODO
            }
        }
    }
}