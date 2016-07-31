/* global minejs */
class DATA_PACKET_E extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x8e;
    }
    getID() {
        return this.ID;
    }
}