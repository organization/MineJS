/* global minejs */
class UNCONNECTED_PING extends minejs.raknet.protocol.AcknowledgePacket {
    static get ID() {
        return 0x01;
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
        this.__put(minejs.raknet.Raknet.MAGIC);
    }

    decode() {
        super.decode();
        this.pingID = this.__getLong();
    }
}

minejs.raknet.protocol.packet.UNCONNECTED_PING = UNCONNECTED_PING;
