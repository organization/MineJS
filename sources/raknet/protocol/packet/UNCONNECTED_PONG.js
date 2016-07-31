/* global minejs */
class UNCONNECTED_PONG extends minejs.raknet.protocol.AcknowledgePacket {
    static get ID() {
        return 0x1c;
    }
    getID() {
        return this.ID;
    }

    constructor() {
        this.pingID = null;
        this.serverID = null;
        this.serverName = null;
    }

    encode() {
        super.encode();
        this.__putLong(this.pingID);
        this.__putLong(this.serverID);
        this.__put(minejs.raknet.Raknet.MAGIC);
        this.__putString(this.serverName);
    }

    decode() {
        super.decode();
        this.pingID = this.__getLong();
        this.serverID = this.__getLong();
        this.__offset += 16; //skip magic bytes TODO:check magic?
        this.serverName = this.__getString();
    }
}