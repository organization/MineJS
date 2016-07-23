'use strict';

module.exports = {
    /* global minejs */
    onLoad : ()=>{
        minejs.raknet.server.SessionManager = class SessionManager{
            constructor(){
                this.packetPool = [];
                this.portChecking = false;
                this.packetLimit = 1000;
                this.name = "";
                    
                this.registerPackets();
                this.serverId = Math.floor(Math.pow(10, 18) + Math.random() * 9 * Math.pow(10, 18));
                
                /** UDP 패킷을 전달받습니다. **/
                minejs.raknet.server.UDPServerSocket.getInstance().registerListener(this);
            }
            
            receivePacket(buffer, source, port){
                let len = buffer.length;
                if(len > 0){
                    let pid = buffer[0];
                    
                    if(pid == minejs.raknet.protocol.packet.UNCONNECTED_PONG.ID)
                        return false;
                    
                    let packet = this.getPacketFromPool(pid);
                    if(packet != null){
                        packet.buffer = buffer;
                        this.getSession(source, port).handlePacket(packet);
                    }else if (pid == minejs.raknet.protocol.packet.UNCONNECTED_PING.ID){
                        packet = new minejs.raknet.protocol.packet.UNCONNECTED_PING();
                        packet.buffer = buffer;
                        packet.decode();
    
                        let pk = new minejs.raknet.protocol.packet.UNCONNECTED_PONG();
                        pk.serverID = this.getID();
                        pk.pingID = packet.pingID;
                        pk.serverName = this.getName();
                        this.sendPacket(pk, source, port);
                    }else if (buffer.length != 0) {
                        this.streamRAW(source, port, buffer);
                        return true;
                    }else{
                        return false;
                    }
                }
                return false;
            }
            
            sendPacket(packet, dest, port){
                packet.encode();
                this.sendBytes += minejs.raknet.server.UDPServerSocket.getInstance().sendPacket(packet.buffer, dest, port);
            }
            
            streamEncapsulated(session, packet){
                this.streamEncapsulated(session, packet, minejs.raknet.RakNet.PRIORITY_NORMAL);
            }
            
            streamEncapsulated(session, packet, flags){
                let id = session.getAddress() + ":" + session.getPort();
                let idBytes = [];
                for (let i = 0; i < id.length; ++i) { idBytes.push(id.charCodeAt(i)); }
                let buffer = minejs.utils.Binary.appendBytes(
                        minejs.raknet.RakNet.PACKET_ENCAPSULATED,
                        [id.length() & 0xff],
                        idBytes,
                        [flags & 0xff],
                        packet.toBinary(true)
                );
                this.receiveStream(buffer);
            }
            
            streamRAW(address, port, payload){
                let addressByte = [];
                for (let i = 0; i < address.length; ++i) { addressByte.push(address.charCodeAt(i)); }
                let buffer = minejs.utils.Binary.appendBytes(
                        minejs.raknet.RakNet.PACKET_RAW,
                        [(address.length() & 0xff)],
                        addressByte,
                        minejs.utils.Binary.writeShort(port),
                        payload
                );
                this.receiveStream(buffer);
            }
            
            streamClose(identifier, reason){
                let identifierByte = [];
                for (let i = 0; i < identifier.length; ++i) { identifierByte.push(identifier.charCodeAt(i)); }
                let reasonByte = [];
                for (let i = 0; i < reason.length; ++i) { reasonByte.push(reason.charCodeAt(i)); }
                
                let buffer = minejs.utils.Binary.appendBytes(
                        minejs.raknet.RakNet.PACKET_CLOSE_SESSION,
                        [identifier.length() & 0xff],
                        identifierByte,
                        [reason.length() & 0xff],
                        reasonByte
                );
                this.receiveStream(buffer);
            }
            
            streamInvalid(identifier){
                let identifierByte = [];
                for (let i = 0; i < identifier.length; ++i) { identifierByte.push(identifier.charCodeAt(i)); }
                
                let buffer = minejs.utils.Binary.appendBytes(
                        minejs.raknet.RakNet.PACKET_INVALID_SESSION,
                        [identifier.length() & 0xff],
                        identifierByte
                );
                this.receiveStream(buffer);
            }
            
            streamOpen(session){
                let identifier = session.getAddress() + ":" + session.getPort();
                let identifierByte = [];
                for (let i = 0; i < identifier.length; ++i) { identifierByte.push(identifier.charCodeAt(i)); }
                
                let sessionAddress = session.getAddress();
                let sessionAddressByte = [];
                for (let i = 0; i < sessionAddress.length; ++i) { sessionAddressByte.push(sessionAddress.charCodeAt(i)); }
                
                let buffer = minejs.utils.Binary.appendBytes(
                        minejs.raknet.RakNet.PACKET_OPEN_SESSION,
                        [identifier.length() & 0xff],
                        identifierByte,
                        [session.getAddress().length() & 0xff],
                        sessionAddressByte,
                        minejs.utils.Binary.writeShort(session.getPort()),
                        minejs.utils.Binary.writeLong(session.getID())
                );
                this.receiveStream(buffer);
            }
            
            streamACK(identifier, identifierACK){
                let identifierByte = [];
                for (let i = 0; i < identifier.length; ++i) { identifierByte.push(identifier.charCodeAt(i)); }
                
                let buffer = minejs.utils.Binary.appendBytes(
                        minejs.raknet.RakNet.PACKET_ACK_NOTIFICATION,
                        [identifier.length() & 0xff],
                        identifierByte,
                        minejs.utils.Binary.writeInt(identifierACK)
                );
                this.receiveStream(buffer);
            }
            
            streamOption(name, value){
                let nameByte = [];
                for (let i = 0; i < name.length; ++i) { nameByte.push(name.charCodeAt(i)); }
                
                let valueByte = [];
                for (let i = 0; i < value.length; ++i) { valueByte.push(value.charCodeAt(i)); }
                
                let buffer = minejs.utils.Binary.appendBytes(
                        minejs.raknet.RakNet.PACKET_SET_OPTION,
                        [name.length() & 0xff],
                        nameByte,
                        valueByte
                );
                this.receiveStream(buffer);
            }
            
            receiveStream(packet){
                //TODO
                if (packet != null && packet.length > 0) {
                    let id = packet[0];
                    let offset = 1;
                    
                    let RakNet = minejs.raknet.RakNet;
                    let Binary = minejs.utils.Binary;
                    switch (id) {
                        case RakNet.PACKET_ENCAPSULATED:
                            let len = packet[offset++];
                            let identifier = String(Binary.subBytes(packet, offset, len));
                            offset += len;
                            
                            //TODO Need a Global Session
                            //if (this.sessions.containsKey(identifier)) {
                            //    byte flags = packet[offset++];
                            //    byte[] buffer = Binary.subBytes(packet, offset);
                            //    this.sessions.get(identifier).addEncapsulatedToQueue(EncapsulatedPacket.fromBinary(buffer, true), flags);
                            //} else {
                            //    this.streamInvalid(identifier);
                            //}
                            break;
                        case RakNet.PACKET_RAW:
                            len = packet[offset++];
                            let address = String(Binary.subBytes(packet, offset, len));
                            offset += len;
                            let port = Binary.readShort(Binary.subBytes(packet, offset, 2));
                            offset += 2;
                            let payload = Binary.subBytes(packet, offset);
                            minejs.raknet.server.UDPServerSocket.getInstance().sendPacket(payload, address, port);
                            break;
                        case RakNet.PACKET_CLOSE_SESSION:
                            len = packet[offset++];
                            identifier = String(Binary.subBytes(packet, offset, len));
                            
                            //TODO Need a Global Session
                            //if (this.sessions.containsKey(identifier)) {
                            //    this.removeSession(this.sessions.get(identifier));
                            //} else {
                            //    this.streamInvalid(identifier);
                            //}
                            break;
                        case RakNet.PACKET_INVALID_SESSION:
                            len = packet[offset++];
                            identifier = String(Binary.subBytes(packet, offset, len));
                            
                            //TODO Need a Global Session
                            //if (this.sessions.containsKey(identifier)) {
                            //    this.removeSession(this.sessions.get(identifier));
                            //}
                            break;
                        case RakNet.PACKET_SET_OPTION:
                            len = packet[offset++];
                            let name = String(Binary.subBytes(packet, offset, len));
                            offset += len;
                            let value = String(Binary.subBytes(packet, offset));
                            switch (name) {
                                case "name":
                                    this.name = value;
                                    break;
                                case "portChecking":
                                    this.portChecking = value;
                                    break;
                                case "packetLimit":
                                    this.packetLimit = value;
                                    break;
                            }
                            break;
                        case RakNet.PACKET_BLOCK_ADDRESS:
                            len = packet[offset++];
                            address = String(Binary.subBytes(packet, offset, len));
                            offset += len;
                            let timeout = Binary.readInt(Binary.subBytes(packet, offset, 4));
                            this.blockAddress(address, timeout);
                            break;
                        case RakNet.PACKET_SHUTDOWN:
                            
                            //TODO Need a Global Session
                            //for (Session session : new ArrayList<>(this.sessions.values())) {
                            //    this.removeSession(session);
                            //}
                            break;
                        case RakNet.PACKET_EMERGENCY_SHUTDOWN:
                            break;
                        default:
                            return false;
                    }
                    return true;
                }
                return false;
            }
            
            blockAddress(address){
                this.blockAddress(address, 300);
            }
            
            blockAddress(address, timeout){
                //TODO Need a Global Session
                //long finalTime = System.currentTimeMillis() + timeout * 1000;
                //if (!this.block.containsKey(address) || timeout == -1) {
                //    if (timeout == -1) {
                //        finalTime = Long.MAX_VALUE;
                //    } else {
                //        this.getLogger().notice("Blocked " + address + " for " + timeout + " seconds");
                //    }
                //    this.block.put(address, finalTime);
                //} else if (this.block.get(address) < finalTime) {
                //    this.block.put(address, finalTime);
                //}
            }
            
            registerPacket(id, factory){
                this.packetPool[id & 0xFF] = factory;
            }
            
            getName(){
                return this.name;
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
                    this.registerPacket(packetMap[key].ID, packetMap[key]);
            }
        }
    }
}