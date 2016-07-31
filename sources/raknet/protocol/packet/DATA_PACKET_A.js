/* global minejs */
class DATA_PACKET_A extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x8a;
    }
    getID() {
        return this.ID;
    }
}