'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.DATA_PACKET_6 =
        
        class DATA_PACKET_6 extends minejs.raknet.protocol.DataPacket{
            static get ID() { return 0x86; }
            getID(){ return this.ID; }
        };
    }
};