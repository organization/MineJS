/* global minejs */
minejs.loader.requireLoader("minejs.raknet.protocol.Packet");
class AcknowledgePacket extends minejs.raknet.protocol.Packet {
    constructor() {
        super();
        this.packets = [];
        this.seqNumber = null;
    }

    encode() {
        super.encode();
        let count = this.packets.length;
        let packets = [];

        let index = 0;
        for (let i in this.packets) {
            packets[index++] = i;
        }
        let records = 0;
        let payload = [];
        let Binary = minejs.utils.Binary;

        if (count > 0) {
            let pointer = 1;
            let start = packets[0];
            let last = packets[0];

            while (pointer < count) {
                let current = packets[pointer++];
                let diff = current - last;
                if (diff == 1) {
                    last = current;
                }
                else if (diff > 1) {

                    if (start == last) {
                        payload.push(0x01);
                        payload.push(Binary.writeLTriad(start));
                        start = last = current;
                    }
                    else {
                        payload.push(0x00);
                        payload.push(Binary.writeLTriad(start));
                        payload.push(Binary.writeLTriad(last));
                        start = last = current;
                    }
                    ++records;
                }
            }

            if (start == last) {
                payload.push(0x01);
                payload.push(Binary.writeLTriad(start));
            }
            else {
                payload.push(0x00);
                payload.push(Binary.writeLTriad(start));
                payload.push(Binary.writeLTriad(last));
            }
            ++records;
        }

        this.__putShort(records);
        this.buffer = Binary.appendBytes(
            this.buffer,
            payload
        );
    }

    decode() {
        super.decode();
        let count = this.__getSignedShort();
        this.packets = [];
        let cnt = 0;
        for (let i = 0; i < count && !this.__feof() && cnt < 4096; ++i) {
            if (this.__getByte() == 0) {
                let start = this.__getLTriad();
                let end = this.__getLTriad();
                if ((end - start) > 512) {
                    end = start + 512;
                }
                for (let c = start; c <= end; ++c) {
                    this.packets.push(cnt++, c);
                }
            }
            else {
                this.packets.push(cnt++, this.__getLTriad());
            }
        }
    }

    clean() {
        this.packets = [];
        return super.clean();
    }

    clone() {
        let clone = require('clone');
        return clone(this);
    }
}