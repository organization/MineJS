/* global minejs */
class DATA_PACKET_9 extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x89;
    }
    getID() {
        return this.ID;
    }
}