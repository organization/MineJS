'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.DATA_PACKET_8 =
        
        class DATA_PACKET_8 extends minejs.raknet.protocol.DataPacket{
            static get ID() { return 0x88; }
            getID(){ return this.ID; }
        };
    }
};