'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.DATA_PACKET_3 =
        
        class DATA_PACKET_3 extends minejs.raknet.protocol.DataPacket{
            static get ID() { return 0x83; }
            getID(){ return this.ID; }
        }
    }
}