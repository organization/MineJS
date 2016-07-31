/* global minejs */
class DATA_PACKET_6 extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x86;
    }
    getID() {
        return this.ID;
    }
}