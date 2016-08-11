/* global minejs */
class CLIENT_CONNECT_DataPacket extends minejs.raknet.protocol.Packet {
    static get ID() {
        return 0x09;
    }

    getID() {
        return this.ID;
    }

    constructor() {
        this.clientID = null;
        this.sendPing = null;
        this.useSecurity = false;
    }

    encode() {
        super.encode();
        this.__putLong(this.clientID);
        this.__putLong(this.sendPing);
        this.__putByte((this.useSecurity ? 1 : 0));
    }

    decode() {
        super.decode();
        this.clientID = this.__getLong();
        this.sendPing = this.__getLong();
        this.useSecurity = this.__getByte() > 0;
    }
}

minejs.raknet.protocol.packet.CLIENT_CONNECT_DataPacket = CLIENT_CONNECT_DataPacket;
