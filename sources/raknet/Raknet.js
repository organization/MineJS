/* global minejs */
class Raknet {
    static get VERSION() {
        return "1.1.0";
    }
    static get PROTOCOL() {
        return 6;
    }
    static get MAGIC() {
        return [0x00, 0xff, 0xff, 0x00, 0xfe,
            0xfe, 0xfe, 0xfe, 0xfd, 0xfd, 0xfd, 0xfd, 0x12, 0x34, 0x56, 0x78
        ];
    }
    static get PRIORITY_NORMAL() {
        return 0;
    }
    static get PRIORITY_IMMEDIATE() {
        return 1;
    }
    static get FLAG_NEED_ACK() {
        return 0b00001000;
    }

    /*
     * ENCAPSULATED payload:
     * byte (identifier length)
     * byte[] (identifier)
     * byte (flags, last 3 bits, priority)
     * payload (binary internal EncapsulatedPacket)
     */
    static get PACKET_ENCAPSULATED() {
        return 0x01;
    }

    /*
     * OPEN_SESSION payload:
     * byte (identifier length)
     * byte[] (identifier)
     * byte (address length)
     * byte[] (address)
     * short (port)
     * long (clientID)
     */
    static get PACKET_OPEN_SESSION() {
        return 0x02;
    }

    /*
     * CLOSE_SESSION payload:
     * byte (identifier length)
     * byte[] (identifier)
     * string (reason)
     */
    static get PACKET_CLOSE_SESSION() {
        return 0x03;
    }

    /*
     * INVALID_SESSION payload:
     * byte (identifier length)
     * byte[] (identifier)
     */
    static get PACKET_INVALID_SESSION() {
        return 0x04;
    }

    /* SEND_QUEUE payload:
     * byte (identifier length)
     * byte[] (identifier)
     */
    static get PACKET_SEND_QUEUE() {
        return 0x05;
    }

    /*
     * ACK_NOTIFICATION payload:
     * byte (identifier length)
     * byte[] (identifier)
     * int (identifierACK)
     */
    static get PACKET_ACK_NOTIFICATION() {
        return 0x06;
    }

    /*
     * SET_OPTION payload:
     * byte (option name length)
     * byte[] (option name)
     * byte[] (option value)
     */
    static get PACKET_SET_OPTION() {
        return 0x07;
    }

    /*
     * RAW payload:
     * byte (address length)
     * byte[] (address from/to)
     * short (port)
     * byte[] (payload)
     */
    static get PACKET_RAW() {
        return 0x08;
    }

    /*
     * RAW payload:
     * byte (address length)
     * byte[] (address)
     * int (timeout)
     */
    static get PACKET_BLOCK_ADDRESS() {
        return 0x09;
    }

    /*
     * No payload
     *
     * Sends the disconnect message, removes sessions correctly, closes sockets.
     */
    static get PACKET_SHUTDOWN() {
        return 0x7e;
    }

    /*
     * No payload
     *
     * Leaves everything as-is and halts, other Threads can be in a post-crash condition.
     */
    static get PACKET_EMERGENCY_SHUTDOWN() {
        return 0x7f;
    }
}

minejs.raknet.Raknet = Raknet;
