/* global minejs */
class DATA_PACKET_1 extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x81;
    }

    getID() {
        return this.ID;
    }
}

minejs.raknet.protocol.packet.DATA_PACKET_1 = DATA_PACKET_1;
