/* global minejs */
class DATA_PACKET_F extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x8f;
    }
    getID() {
        return this.ID;
    }
}