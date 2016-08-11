/* global minejs */
class OPEN_CONNECTION_REPLY_2 extends minejs.raknet.protocol.Packet {
    static get ID() {
        return 0x08;
    }
    getID() {
        return this.ID;
    }

    constructor() {
        this.serverID = null;
        this.clientAddress = null;
        this.clientPort = null;
        this.mtuSize = null;
    }

    encode() {
        super.encode();
        this.__put(minejs.raknet.RakNet.MAGIC);
        this.__putLong(this.serverID);
        this.__putAddress(this.clientAddress, this.clientPort);
        this.__putShort(this.mtuSize);
        this.__putByte(0); //server security
    }

    decode() {
        super.decode();
        this.__offset += 16; //skip magic bytes
        this.serverID = this.__getLong();
        let address = this.__getAddress();
        this.clientAddress = address[0];
        this.clientPort = address[1];
        this.mtuSize = this.__getSignedShort();
    }
}

minejs.raknet.protocol.packet.OPEN_CONNECTION_REPLY_2 = OPEN_CONNECTION_REPLY_2;
