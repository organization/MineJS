/* global minejs */
class PING_DataPacket extends minejs.raknet.protocol.Packet {
    static get ID() {
        return 0x00;
    }
    getID() {
        return this.ID;
    }

    constructor() {
        this.pingID = null;
    }

    encode() {
        super.encode();
        this.__putLong(this.pingID);
    }

    decode() {
        super.decode();
        this.pingID = this.__getLong();
    }
}

minejs.raknet.protocol.packet.PING_DataPacket = PING_DataPacket;
