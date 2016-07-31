/* global minejs */
class CLIENT_HANDSHAKE_DataPacket extends minejs.raknet.protocol.Packet {
    static get ID() {
        return 0x13;
    }

    getID() {
        return this.ID;
    }

    constructor() {
        this.address = null;
        this.port = null;
        this.systemAddresses = [];
        this.sendPing = null;
        this.sendPong = null;
    }

    encode() {
        super.encode();
    }

    decode() {
        super.decode();
        let addr = this.__getAddress();
        this.address = addr[0];
        this.port = addr[1];

        for (let i = 0; i < 10; i++)
            this.systemAddresses[i] = this.__getAddress();

        this.sendPing = this.__getLong();
        this.sendPong = this.__getLong();
    }
}