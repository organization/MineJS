'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.DATA_PACKET_F =
        
        class DATA_PACKET_F extends minejs.raknet.protocol.DataPacket{
            static get ID() { return 0x8f; }
            getID(){ return this.ID; }
        }
    }
}