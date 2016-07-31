/* global minejs */
class EncapsulatedPacket {
    constructor() {
        this.reliability = null;
        this.hasSplit = null;
        this.length = 0;
        this.messageIndex = null;
        this.orderIndex = null;
        this.orderChannel = null;
        this.splitCount = null;
        this.splitID = null;
        this.splitIndex = null;
        this.buffer = [];
        this.needACK = false;
        this.identifierACK = null;
        this._offset = null;
    }

    getOffset() {
        return this._offset;
    }

    fromBinary(binary) {
        return this.fromBinary(binary, false);
    }

    fromBinary(binary, internal) {
        let packet = new minejs.raknet.protocol.EncapsulatedPacket();
        let flags = binary[0] & 0xff;
        let Binary = minejs.utils.Binary;

        packet.reliability = ((flags & 0b11100000) >> 5);
        packet.hasSplit = (flags & 0b00010000) > 0;

        let length, offset;
        if (internal) {
            length = Binary.readInt(Binary.subBytes(binary, 1, 4));
            packet.identifierACK = Binary.readInt(Binary.subBytes(binary, 5, 4));
            offset = 9;
        }
        else {
            length = Math.ceil((Binary.readShort(Binary.subBytes(binary, 1, 2)) / 8));
            offset = 3;
            packet.identifierACK = null;
        }

        if (packet.reliability > 0) {
            if (packet.reliability >= 2 && packet.reliability != 5) {
                packet.messageIndex = Binary.readLTriad(Binary.subBytes(binary, offset, 3));
                offset += 3;
            }

            if (packet.reliability <= 4 && packet.reliability != 2) {
                packet.orderIndex = Binary.readLTriad(Binary.subBytes(binary, offset, 3));
                offset += 3;
                packet.orderChannel = binary[offset++] & 0xff;
            }
        }

        if (packet.hasSplit) {
            packet.splitCount = Binary.readInt(Binary.subBytes(binary, offset, 4));
            offset += 4;
            packet.splitID = Binary.readShort(Binary.subBytes(binary, offset, 2));
            offset += 2;
            packet.splitIndex = Binary.readInt(Binary.subBytes(binary, offset, 4));
            offset += 4;
        }

        packet.buffer = Binary.subBytes(binary, offset, length);
        offset += length;
        packet.offset = offset;

        return packet;
    }

    getTotalLength() {
        return 3 + this.buffer.length + (this.messageIndex != null ? 3 : 0) + (this.orderIndex != null ? 4 : 0) + (this.hasSplit ? 10 : 0);
    }

    toBinary() {
        return this.toBinary(false);
    }

    toBinary(internal) {
        let stream = [];
        let Binary = minejs.utils.Binary;

        stream.push((this.reliability << 5) | (this.hasSplit ? 0b00010000 : 0));
        if (internal) {
            stream.push(Binary.writeInt(this.buffer.length));
            stream.push(Binary.writeInt(this.identifierACK == null ? 0 : this.identifierACK));
        }
        else {
            stream.push(Binary.writeShort(this.buffer.length << 3));
        }

        if (this.reliability > 0) {
            if (this.reliability >= 2 && this.reliability != 5) {
                stream.push(Binary.writeLTriad(this.messageIndex == null ? 0 : this.messageIndex));
            }
            if (this.reliability <= 4 && this.reliability != 2) {
                stream.push(Binary.writeLTriad(this.orderIndex));
                stream.push((this.orderChannel & 0xff));
            }
        }

        if (this.hasSplit) {
            stream.push(Binary.writeInt(this.splitCount));
            stream.push(Binary.writeShort(this.splitID));
            stream.push(Binary.writeInt(this.splitIndex));
        }

        stream.push(this.buffer);
        return stream;
    }

    toString() {
        return minejs.utils.Binary.bytesToHexString(this.toBinary());
    }

    clone() {
        let clone = require('clone');
        return clone(this);
    }
}