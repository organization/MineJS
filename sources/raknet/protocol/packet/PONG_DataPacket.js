'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.PONG_DataPacket =
        
        class PONG_DataPacket extends minejs.raknet.protocol.Packet{
            static get ID() { return 0x03; }
            getID(){ return this.ID; }
            
            constructor(){
                this.pingID = null;
            }
            
            encode(){
                super.encode();
                this.__putLong(this.pingID);
            }
            
            decode(){
                super.decode();
                this.pingID = this.__getLong();
            }
        };
    }
};