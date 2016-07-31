/* global minejs */
class OPEN_CONNECTION_REQUEST_2 extends minejs.raknet.protocol.Packet {
    static get ID() { return 0x07;}
    getID() {
        return this.ID;
    }

    constructor() {
        this.clientID = null;
        this.serverAddress = null;
        this.serverPort = null;
        this.mtuSize = null;
    }

    encode() {
        super.encode();
        this.__put(minejs.raknet.RakNet.MAGIC);
        this.__putByte(this.protocol);
        this.__putAddress(this.serverAddress, this.serverPort);
        this.__putShort(this.mtuSize);
        this.__putLong(this.clientID);
    }

    decode() {
        super.decode();
        this.__offset += 16; //skip magic bytes
        let address = this.__getAddress();
        this.serverAddress = address[0];
        this.serverPort = address[1];
        this.mtuSize = this.__getSignedShort();
        this.clientID = this.__getLong();
    }
}