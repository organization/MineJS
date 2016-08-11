/* global minejs */
minejs.loader.requireLoader("minejs.raknet.protocol.Packet");

class DataPacket extends minejs.raknet.protocol.Packet {
    constructor() {
        super();
        this.packets = [];
        this.seqNumber = null;
    }

    encode() {
        super.encode();
        this.__putLTriad(this.seqNumber);

        for (let packet in this.packets)
            this.put(packet instanceof minejs.raknet.protocol.EncapsulatedPacket ? packet.toBinary() : packet);
    }

    length() {
        let length = 4;
        for (let packet in this.packets)
            length += packet instanceof minejs.raknet.protocol.EncapsulatedPacket ? packet.getTotalLength() : packet.length;
        return length;
    }

    decode() {
        super.decode();
        this.seqNumber = this.__getLTriad();

        while (!this.__feof()) {
            let data = minejs.utils.Binary.subBytes(this.buffer, this.offset);
            let packet = minejs.raknet.protocol.EncapsulatedPacket.fromBinary(data, false);
            this.__offset += packet.getOffset();
            if (packet.buffer.length == 0) break;
            this.packets.add(packet);
        }
    }

    clean() {
        this.packets = [];
        this.seqNumber = null;
        return super.clean();
    }

    clone() {
        let clone = require('clone');
        return clone(this);
    }
}

minejs.raknet.protocol.DataPacket = DataPacket;
