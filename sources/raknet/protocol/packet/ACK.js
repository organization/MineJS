'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.packet.ACK =
        
        class ACK extends minejs.raknet.protocol.AcknowledgePacket{
            static get ID() { return 0xc0; }
            getID(){ return this.ID; }
        }
    }
}