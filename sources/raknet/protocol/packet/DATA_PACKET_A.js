/* global minejs */
class DATA_PACKET_A extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x8a;
    }
    getID() {
        return this.ID;
    }
}

minejs.raknet.protocol.packet.DATA_PACKET_A = DATA_PACKET_A;
