/* global minejs */
var binaryInstance = null;
class Binary {
    //Triad: {0x00,0x00,0x01}<=>1
    static readTriad(bytes) {
        return this.readInt([
            0x00,
            bytes[0],
            bytes[1],
            bytes[2]
        ]);
    }

    static writeTriad(value) {
        return [
            ((value >>> 16) & 0xFF),
            ((value >>> 8) & 0xFF),
            (value & 0xFF)
        ];
    }

    //LTriad: {0x01,0x00,0x00}<=>1
    static readLTriad(bytes) {
        return this.readLInt([
            bytes[0],
            bytes[1],
            bytes[2],
            0x00
        ]);
    }

    static writeLTriad(value) {
        return [
            (value & 0xFF),
            ((value >>> 8) & 0xFF),
            ((value >>> 16) & 0xFF)
        ];
    }

    static readUUID(bytes) {
        return require('node-uuid').unparse(bytes);
    }
    static writeUUID(uuid) {
        return require('node-uuid').parse(uuid);
    }

    static writeMetadata(metadata) {
        //TODO
    }

    static readMetadata(payload) {
        //TODO
    }

    static readBool(b) {
        return b == 0;
    }
    static writeBool(b) {
        return (b ? 0x01 : 0x00);
    }
    static readSignedByte(b) {
        return b & 0xFF;
    }
    static writeByte(b) {
        return b;
    }
    static readShort(bytes) {
        ((bytes[0] & 0xFF) << 8) + (bytes[1] & 0xFF);
    }
    static readSignedShort(bytes) {
        return this.readShort(bytes);
    }

    static writeShort(s) {
        return [
            ((s >>> 8) & 0xFF),
            (s & 0xFF)
        ];
    }

    static readLShort(bytes) {
        return (bytes[1] & 0xFF << 8) + (bytes[0] & 0xFF);
    }

    static readSignedLShort(bytes) {
        return this.readLShort(bytes);
    }

    static writeLShort(s) {
        s &= 0xffff;
        return [
            (s & 0xFF),
            ((s >>> 8) & 0xFF)
        ];
    }

    static readInt(bytes) {
        return ((bytes[0] & 0xff) << 24) +
            ((bytes[1] & 0xff) << 16) +
            ((bytes[2] & 0xff) << 8) +
            (bytes[3] & 0xff);
    }

    static writeInt(i) {
        return [
            ((i >>> 24) & 0xFF),
            ((i >>> 16) & 0xFF),
            ((i >>> 8) & 0xFF),
            (i & 0xFF)
        ];
    }

    static readLInt(bytes) {
        return ((bytes[3] & 0xff) << 24) +
            ((bytes[2] & 0xff) << 16) +
            ((bytes[1] & 0xff) << 8) +
            (bytes[0] & 0xff);
    }

    static writeLInt(i) {
        return [
            (i & 0xFF),
            ((i >>> 8) & 0xFF),
            ((i >>> 16) & 0xFF),
            ((i >>> 24) & 0xFF)
        ];
    }

    static readFloat(bytes) {
        return require('int-bits')(this.readInt(bytes));
    }

    static writeFloat(f) {
        return this.writeInt(require('int-bits').unpack(f));
    }

    static readLFloat(bytes) {
        return require('int-bits')(this.readLInt(bytes));
    }

    static writeLFloat(f) {
        return this.writeLint(require('int-bits').unpack(f));
    }

    static readDouble(bytes) {
        //TODO
    }

    static writeDouble(d) {
        //TODO
    }

    static readLDouble(bytes) {
        //TODO
    }

    static writeLDouble(bytes) {
        //TODO
    }

    static readLong(bytes) {
        return ((bytes[0] << 56) +
            ((bytes[1] & 0xFF) << 48) +
            ((bytes[2] & 0xFF) << 40) +
            ((bytes[3] & 0xFF) << 32) +
            ((bytes[4] & 0xFF) << 24) +
            ((bytes[5] & 0xFF) << 16) +
            ((bytes[6] & 0xFF) << 8) +
            ((bytes[7] & 0xFF)));
    }

    static writeLong(l) {
        return [(l >>> 56),
            (l >>> 48),
            (l >>> 40),
            (l >>> 32),
            (l >>> 24),
            (l >>> 16),
            (l >>> 8), (l)
        ];
    }

    static readLLong(bytes) {
        return ((bytes[7] << 56) +
            ((bytes[6] & 0xFF) << 48) +
            ((bytes[5] & 0xFF) << 40) +
            ((bytes[4] & 0xFF) << 32) +
            ((bytes[3] & 0xFF) << 24) +
            ((bytes[2] & 0xFF) << 16) +
            ((bytes[1] & 0xFF) << 8) +
            ((bytes[0] & 0xFF)));
    }

    static writeLLong(l) {
        return [(l),
            (l >>> 8),
            (l >>> 16),
            (l >>> 24),
            (l >>> 32),
            (l >>> 40),
            (l >>> 48),
            (l >>> 56)
        ];
    }

    static reserveBytes(bytes) {
        let newBytes = [];
        for (let i = 0; i < bytes.length; i++)
            newBytes[bytes.length - 1 - i] = bytes[i];
        return newBytes;
    }

    static bytesToHexString(src) {
        this.bytesToHexString(src, false);
    }

    static bytesToHexString(src, blank) {
        if (src == null || src.length <= 0)
            return null;

        let stringBuilder = "";
        for (let b in src) {
            if (stringBuilder.length == 0 && blank)
                stringBuilder += " ";
            let v = b & 0xFF;
            let hv = String(v);
            if (hv.length < 2)
                stringBuilder += "0";
            stringBuilder += hv;
        }
        return stringBuilder.toString().toUpperCase();
    }

    static hexStringToBytes(hexString) {
        // TODO
    }

    static subBytes(bytes, start, length) {
        let len = Math.min(bytes.length, start + length);
        return this.copyOfRange(bytes, start, len);
    }

    static subBytes(bytes, start) {
        return this.subBytes(bytes, start, bytes.length - start);
    }

    static splitBytes(bytes, chunkSize) {
        // TODO
    }

    static appendBytes(bytes) {
        // TODO
    }

    static appendBytes() {
        let appendArray = [];
        for (let key in arguments)
            for (let byte in arguments[key])
                appendArray.push(byte);
        return appendArray;
    }

    static copyOfRange(original, from, to) {
        let copy = [];
        for (let i = (from - 1); i < to; i++) {
            if (original[i] == null) {
                copy.push(0);
                continue;
            }
            copy.push(original[i]);
        }
        return copy;
    }
}