/* global minejs */
class DATA_PACKET_8 extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x88;
    }
    getID() {
        return this.ID;
    }
}