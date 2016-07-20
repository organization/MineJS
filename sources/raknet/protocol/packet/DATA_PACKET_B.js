'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.DATA_PACKET_B =
        
        class DATA_PACKET_B extends minejs.raknet.protocol.DataPacket{
            static get ID() { return 0x8b; }
            getID(){ return this.ID; }
        }
    }
}