'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.loader.requireLoader("minejs.raknet.protocol.packet.UNCONNECTED_PONG");
        
        minejs.raknet.protocol.packet.ADVERTISE_SYSTEM =
        class ADVERTISE_SYSTEM extends minejs.raknet.protocol.packet.UNCONNECTED_PONG{
            static get ID() { return 0x1c; }
            getID(){ return this.ID; }
        }
    }
}