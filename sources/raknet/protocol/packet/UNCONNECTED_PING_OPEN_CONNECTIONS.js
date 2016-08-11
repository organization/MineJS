/* global minejs */
class UNCONNECTED_PING_OPEN_CONNECTIONS extends minejs.raknet.protocol.packet.UNCONNECTED_PING {
    static get ID() {
        return 0x02;
    }
    getID() {
        return this.ID;
    }
}

minejs.raknet.protocol.packet.UNCONNECTED_PING_OPEN_CONNECTIONS = UNCONNECTED_PING_OPEN_CONNECTIONS;
