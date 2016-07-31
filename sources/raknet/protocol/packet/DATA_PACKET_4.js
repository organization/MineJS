/* global minejs */
class DATA_PACKET_4 extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x84;
    }
    getID() {
        return this.ID;
    }
}