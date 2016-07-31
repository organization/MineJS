/* global minejs */
minejs.loader.requireLoader("minejs.raknet.protocol.packet.UNCONNECTED_PONG");

class ADVERTISE_SYSTEM extends minejs.raknet.protocol.packet.UNCONNECTED_PONG {
    static get ID() {
        return 0x1c;
    }
    getID() {
        return this.ID;
    }
}