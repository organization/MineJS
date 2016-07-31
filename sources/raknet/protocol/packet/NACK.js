/* global minejs */
class NACK extends minejs.raknet.protocol.AcknowledgePacket {
    static get ID() {
        return 0xa0;
    }
    getID() {
        return this.ID;
    }
}