'use strict';

module.exports = {
    /* global minejs */
    onLoad : ()=>{
        var udpServerSocketInstance = null;
        minejs.raknet.server.UDPServerSocket = class UDPServerSocket{
            constructor(){
                if(udpServerSocketInstance != null)
                    return udpServerSocketInstance;
                
                this.sessionManager = new minejs.raknet.server.SessionManager();
                this.listenerMap = [];
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
            
            registerListener(object){
                this.listenerMap.push(object);
            }
            
            receivePacket(buffer, source, port){
                for(let key in this.listenerMap)
                    if (typeof(this.listenerMap[key].receivePacket) === 'function')
                        this.listenerMap[key].receivePacket(buffer, source, port);
            }
            
            sendPacket(buffer, source, port){
                process.send([minejs.network.ProcessProtocol.UDP_WRITE, buffer, source, port]);
            }
        };
    }
};