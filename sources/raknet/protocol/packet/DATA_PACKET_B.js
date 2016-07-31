/* global minejs */
class DATA_PACKET_B extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x8b;
    }
    getID() {
        return this.ID;
    }
}