'use strict';

module.exports = {
    /* global minejs */
    onLoad : ()=>{
        var udpServerSocketInstance = null;
        minejs.raknet.server.UDPServerSocket = class UDPServerSocket{
            constructor(){
                if(udpServerSocketInstance != null)
                    return udpServerSocketInstance;
                    
                this.packetPool = [];
                    
                this.registerPackets();
                this.serverId = Math.floor(Math.pow(10, 18) + Math.random() * 9 * Math.pow(10, 18));
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
                let len = buffer.length;
                if(len > 0){
                    let pid = buffer[0];
                    
                    if(pid == minejs.raknet.protocol.packet.UNCONNECTED_PONG.ID)
                        return false;
                    
                    let packet = this.getPacketFromPool(pid);
                    if(packet != null){
                        //TODO
                    }else if (pid == minejs.raknet.protocol.packet.UNCONNECTED_PING.ID){
                        
                    }else if (buffer.length != 0) {
                        this.streamRAW(source, port, buffer);
                        return true;
                    }else{
                        return false;
                    }
                }
                //TODO
                
            }
            
            sendPacket(buffer, source, port){
                //TODO
            }
            
            registerPacket(id, factory){
                this.packetPool[id & 0xFF] = factory;
            }
            
            getID(){
                return this.serverId;
            }
            
            getPacketFromPool(id){
                return this.packetPool[id & 0xFF].create();
            }
            
            _registerPackets(){
                let packetMap = [
                    minejs.raknet.protocol.packet.UNCONNECTED_PING_OPEN_CONNECTIONS,
                    minejs.raknet.protocol.packet.OPEN_CONNECTION_REQUEST_1,
                    minejs.raknet.protocol.packet.OPEN_CONNECTION_REPLY_1,
                    minejs.raknet.protocol.packet.OPEN_CONNECTION_REQUEST_2,
                    minejs.raknet.protocol.packet.OPEN_CONNECTION_REPLY_2,
                    minejs.raknet.protocol.packet.UNCONNECTED_PONG,
                    minejs.raknet.protocol.packet.ADVERTISE_SYSTEM,
                    minejs.raknet.protocol.packet.DATA_PACKET_0,
                    minejs.raknet.protocol.packet.DATA_PACKET_1,
                    minejs.raknet.protocol.packet.DATA_PACKET_2,
                    minejs.raknet.protocol.packet.DATA_PACKET_3,
                    minejs.raknet.protocol.packet.DATA_PACKET_4,
                    minejs.raknet.protocol.packet.DATA_PACKET_5,
                    minejs.raknet.protocol.packet.DATA_PACKET_6,
                    minejs.raknet.protocol.packet.DATA_PACKET_7,
                    minejs.raknet.protocol.packet.DATA_PACKET_8,
                    minejs.raknet.protocol.packet.DATA_PACKET_9,
                    minejs.raknet.protocol.packet.DATA_PACKET_A,
                    minejs.raknet.protocol.packet.DATA_PACKET_B,
                    minejs.raknet.protocol.packet.DATA_PACKET_C,
                    minejs.raknet.protocol.packet.DATA_PACKET_D,
                    minejs.raknet.protocol.packet.DATA_PACKET_E,
                    minejs.raknet.protocol.packet.DATA_PACKET_F,
                    minejs.raknet.protocol.packet.NACK,
                    minejs.raknet.protocol.packet.ACK
                ];
                
                for(let key in packetMap)
                    this.registerPacket(packetMap[key].ID, new packetMap[key]);
            }
        }
    }
}