'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.DATA_PACKET_C =
        
        class DATA_PACKET_C extends minejs.raknet.protocol.DataPacket{
            static get ID() { return 0x8c; }
            getID(){ return this.ID; }
        }
    }
}