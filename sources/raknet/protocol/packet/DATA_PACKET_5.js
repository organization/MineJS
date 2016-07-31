/* global minejs */
class DATA_PACKET_5 extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x85;
    }
    getID() {
        return this.ID;
    }
}