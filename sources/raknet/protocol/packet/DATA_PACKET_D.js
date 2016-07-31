/* global minejs */
class DATA_PACKET_D extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x8d;
    }
    getID() {
        return this.ID;
    }
}