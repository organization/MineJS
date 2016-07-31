/* global minejs */

class OPEN_CONNECTION_REPLY_1 extends minejs.raknet.protocol.Packet {
    static get ID() {
        return 0x06;
    }
    getID() {
        return this.ID;
    }

    constructor() {
        this.serverID = null;
        this.mtuSize = null;
    }

    encode() {
        super.encode();
        this.__put(minejs.raknet.RakNet.MAGIC);
        this.__putLong(this.serverID);
        this.__putByte(0); //server security
        this.__putShort(this.mtuSize);
    }

    decode() {
        super.decode();
        this.__offset += 16; //skip magic bytes
        this.serverID = this.__getLong();
        this.__getByte(); //skip security
        this.mtuSize = this.__getSignedShort();
    }
}