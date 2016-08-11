/* global minejs */
class DATA_PACKET_6 extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x86;
    }
    getID() {
        return this.ID;
    }
}

minejs.raknet.protocol.packet.DATA_PACKET_6 = DATA_PACKET_6;
