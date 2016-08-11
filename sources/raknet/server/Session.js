/* global minejs */
class Session {
    static get STATE_UNCONNECTED() {
        return 0;
    }
    static get STATE_CONNECTING_1() {
        return 1;
    }
    static get STATE_CONNECTING_2() {
        return 2;
    }
    static get STATE_CONNECTED() {
        return 3;
    }

    static get MAX_SPLIT_SIZE() {
        return 128;
    }
    static get MAX_SPLIT_COUNT() {
        return 4;
    }

    static get WINDOW_SIZE() {
        return 2048;
    }

    constructor() {

    }

    update() {

    }

    disconnect() {
        this.disconnect("unknown");
    }

    disconnect(reason) {
        //this.sessionManager.removeSession(this, reason);
    }

    //sendPacket(){
    //
    //}

    sendQueue() {

    }

    addToQueue(packet) {
        this.addToQueue(packet, minejs.raknet.RakNet.PRIORITY_NORMAL);
    }

    addToQueue(packet, flags) {

    }

    addEncapsulatedToQueue(packet) {

    }

    addEncapsulatedToQueue(packet, flags) {

    }

    handleSplit(packet) {

    }

    handleEncapsulatedPacket(packet) {

    }

    //getState(){
    //    //return state;
    //}

    //isTemporal(){
    //    //return isTemporal;
    //}

    handleEncapsulatedPacketRoute(packet) {

    }

    handlePacket(packet) {

    }

    close() {
        //
    }
}

minejs.raknet.server.Session = Session;
