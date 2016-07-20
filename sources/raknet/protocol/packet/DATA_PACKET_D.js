'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.DATA_PACKET_D =
        
        class DATA_PACKET_D extends minejs.raknet.protocol.DataPacket{
            static get ID() { return 0x8d; }
            getID(){ return this.ID; }
        }
    }
}