'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.DATA_PACKET_5 =
        
        class DATA_PACKET_5 extends minejs.raknet.protocol.DataPacket{
            static get ID() { return 0x85; }
            getID(){ return this.ID; }
        }
    }
}