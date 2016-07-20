'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.NACK =
        
        class NACK extends minejs.raknet.protocol.AcknowledgePacket{
            static get ID() { return 0xa0; }
            getID(){ return this.ID; }
        }
    }
}