/* global minejs */
class ACK extends minejs.raknet.protocol.AcknowledgePacket {
    static get ID() {
        return 0xc0;
    }
    getID() {
        this.ID;
    }
}