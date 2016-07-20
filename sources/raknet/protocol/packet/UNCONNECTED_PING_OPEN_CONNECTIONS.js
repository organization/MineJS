'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.loader.requireLoader("minejs.raknet.protocol.packet.UNCONNECTED_PING");
        
        minejs.raknet.protocol.packet.UNCONNECTED_PING_OPEN_CONNECTIONS =
        class UNCONNECTED_PING_OPEN_CONNECTIONS extends minejs.raknet.protocol.packet.UNCONNECTED_PING{
            static get ID() { return 0x02; }
            getID(){ return this.ID; }
        }
    }
}