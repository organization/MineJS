/* global minejs */
class CLIENT_DISCONNECT_DataPacket extends minejs.raknet.protocol.Packet {
    static get ID() {
        return 0x15;
    }

    getID() {
        return this.ID;
    }
}

minejs.raknet.protocol.packet.CLIENT_DISCONNECT_DataPacket = CLIENT_DISCONNECT_DataPacket;
