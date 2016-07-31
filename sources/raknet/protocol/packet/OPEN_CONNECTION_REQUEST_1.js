/* global minejs */
class OPEN_CONNECTION_REQUEST_1 extends minejs.raknet.protocol.Packet {
    static get ID() {
        return 0x05;
    }
    getID() {
        return this.ID;
    }

    constructor() {
        this.protocol = minejs.raknet.RakNet.PROTOCOL;
        this.mtuSize = null;
    }

    encode() {
        super.encode();
        this.__put(minejs.raknet.RakNet.MAGIC);
        this.__putByte(this.protocol);
        this.__put([this.mtuSize - 18]);
    }

    decode() {
        super.decode();
        this.__offset += 16; //skip magic bytes
        this.protocol = this.__getByte();
        this.mtuSize = (this.__get().length + 18);
    }
}