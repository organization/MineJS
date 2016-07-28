'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.SERVER_HANDSHAKE_DataPacket =
        
        class SERVER_HANDSHAKE_DataPacket extends minejs.raknet.protocol.Packet{
            static get ID() { return 0x10; }
            getID(){ return this.ID; }
            
            constructor(){
                this.address = null;
                this.port = null;
                this.systemAddresses = [
                    ["127.0.0.1", 0],
                    ["0.0.0.0", 0],
                    ["0.0.0.0", 0],
                    ["0.0.0.0", 0],
                    ["0.0.0.0", 0],
                    ["0.0.0.0", 0],
                    ["0.0.0.0", 0],
                    ["0.0.0.0", 0],
                    ["0.0.0.0", 0],
                    ["0.0.0.0", 0]
                ];
                this.sendPing = null;
                this.sendPong = null;
            }
            
            encode(){
                super.encode();
                this.__putAddress(this.address, this.port);
                this.__putShort(0);
                for (let i = 0; i < 10; ++i)
                    this.__putAddress(this.systemAddresses[i][0], this.systemAddresses[i][1]);
        
                this.__putLong(this.sendPing);
                this.__putLong(this.sendPong);
            }
            
            decode(){
                super.decode();
            }
        };
    }
};