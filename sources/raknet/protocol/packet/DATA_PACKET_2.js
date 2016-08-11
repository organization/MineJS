/* global minejs */
class DATA_PACKET_2 extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x82;
    }
    getID() {
        return this.ID;
    }
}

minejs.raknet.protocol.packet.DATA_PACKET_2 = DATA_PACKET_2;
