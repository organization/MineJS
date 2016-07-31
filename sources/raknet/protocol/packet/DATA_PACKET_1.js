/* global minejs */
class DATA_PACKET_1 extends minejs.raknet.protocol.DataPacket {
    static get ID() {
        return 0x81;
    }
    
    getID() {
        return this.ID;
    }
}